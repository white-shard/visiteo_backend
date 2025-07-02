import { CacheService } from "@/libs/cache/cache.service"
import { config } from "@/libs/config/app.config"
import { MailService } from "@/libs/mail/mail.service"
import { VerificationLinkTemplate } from "@/libs/mail/templates/verification-link.template"
import { PrismaService } from "@/prisma/prisma.service"
import { UserService } from "@/user/user.service"
import { Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/__generated__"

const FOLDER = config.TOKENS_FOLDER
const TOKEN_TYPE = "EMAIL"
const TOKEN_EXPIRATION = 3600

type TokenData = {
	userId: string
	email: string
	type: string
}

/**
 * Сервис для подтверждения электронной почты пользователей
 *
 * Предоставляет функциональность для:
 * - Генерации JWT токенов подтверждения с ограниченным временем жизни
 * - Отправки писем с ссылками для подтверждения email
 * - Верификации токенов и активации пользователей
 * - Управления кэшем токенов подтверждения
 *
 * Токены хранятся в Redis с временем жизни 1 час (3600 секунд)
 * и содержат информацию о пользователе и email для подтверждения.
 */
@Injectable()
export class EmailConfirmationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cacheService: CacheService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService
	) {}

	/**
	 * Верифицирует токен подтверждения и активирует пользователя
	 *
	 * Процесс верификации:
	 * 1. Декодирует JWT токен и извлекает данные пользователя
	 * 2. Проверяет тип токена (должен быть "EMAIL")
	 * 3. Проверяет существование токена в кэше Redis
	 * 4. Находит пользователя по ID
	 * 5. Обновляет email и активирует пользователя (isEnabled = true)
	 * 6. Удаляет использованный токен из кэша
	 *
	 * @param token - JWT токен подтверждения из ссылки
	 * @returns Promise<User> - Обновленный пользователь с подтвержденным email и активированным статусом
	 * @throws NotFoundException - Если токен недействителен, истек, пользователь не найден или токен отсутствует в кэше
	 * @throws JsonWebTokenError - Если токен имеет неверный формат
	 * @throws TokenExpiredError - Если токен истек
	 */
	public async verifyToken(token: string): Promise<User> {
		try {
			const { userId, type } = await this.jwtService.verifyAsync<TokenData>(
				token,
				{
					ignoreExpiration: true
				}
			)

			if (type !== TOKEN_TYPE)
				throw new NotFoundException(
					"Ссылка недействительна. Запросите новую ссылку для подтверждения"
				)

			const key = `${FOLDER}:${userId}:${TOKEN_TYPE}`
			const existingToken = await this.cacheService.redis.get(key)

			if (!existingToken)
				throw new NotFoundException(
					"Ссылка недействительна. Запросите новую ссылку для подтверждения"
				)

			const data = JSON.parse(existingToken) as { email: string }

			const user = await this.userService.findById(userId)

			if (!user)
				throw new NotFoundException(
					"Пользователь не найден. Запросите новую ссылку для подтверждения"
				)

			await this.prisma.user.update({
				where: { id: user.id },
				data: { email: data.email, isEnabled: true }
			})

			await this.cacheService.redis.del(key)

			return user
		} catch (error) {
			if (
				error instanceof Error &&
				(error.name === "JsonWebTokenError" ||
					error.name === "TokenExpiredError")
			) {
				throw new NotFoundException(
					"Ссылка недействительна. Запросите новую ссылку для подтверждения"
				)
			}
			throw error
		}
	}

	/**
	 * Отправляет письмо с токеном подтверждения на указанный email
	 *
	 * Процесс отправки:
	 * 1. Генерирует новый токен подтверждения
	 * 2. Формирует URL для подтверждения с токеном
	 * 3. Отправляет email с использованием шаблона VerificationLinkTemplate
	 *
	 * @param userId - Уникальный идентификатор пользователя
	 * @param email - Email адрес для подтверждения
	 * @returns Promise<void> - Письмо отправлено успешно
	 * @throws Error - При ошибке генерации токена или отправки письма
	 */
	public async sendToken(userId: string, email: string): Promise<void> {
		const token = await this.generateToken(userId, email)

		const subject = "Подтверждение электронной почты"
		const url = `${config.ALLOWED_ORIGIN}/verify?type=${TOKEN_TYPE}&token=${token}`

		await this.mailService.sendTemplate(
			VerificationLinkTemplate({
				subject,
				message: "Подтвердите ваш email",
				url
			}),
			email,
			subject
		)
	}

	/**
	 * Генерирует токен подтверждения и сохраняет его в кэше
	 *
	 * Процесс генерации:
	 * 1. Формирует ключ для кэша в формате: {FOLDER}:{userId}:{TOKEN_TYPE}
	 * 2. Удаляет существующий токен, если он есть
	 * 3. Сохраняет данные токена в Redis с временем жизни TOKEN_EXPIRATION
	 * 4. Генерирует JWT токен с данными пользователя и email
	 *
	 * @param userId - Уникальный идентификатор пользователя
	 * @param email - Email адрес для подтверждения
	 * @returns Promise<string> - JWT токен подтверждения
	 * @throws Error - При ошибке работы с кэшем или генерации JWT
	 */
	async generateToken(userId: string, email: string): Promise<string> {
		const key = `${FOLDER}:${userId}:${TOKEN_TYPE}`
		const existingToken = await this.cacheService.redis.exists(key)

		if (existingToken) await this.cacheService.redis.del(key)

		await this.cacheService.redis.set(
			key,
			JSON.stringify({ email }),
			"EX",
			TOKEN_EXPIRATION
		)

		return this.jwtService.signAsync({
			userId,
			email,
			type: TOKEN_TYPE
		})
	}
}
