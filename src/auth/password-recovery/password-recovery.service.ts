import { config } from "@/libs/config/app.config"
import { Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { CacheService } from "@/libs/cache/cache.service"
import { MailService } from "@/libs/mail/mail.service"
import { VerificationLinkTemplate } from "@/libs/mail/templates/verification-link.template"
import { User } from "@prisma/__generated__/client"
import { UserService } from "@/user/user.service"
import { PrismaService } from "@/prisma/prisma.service"
import { hash } from "argon2"

const FOLDER = config.TOKENS_FOLDER
const TOKEN_TYPE = "PASSWORD_RECOVERY"
const TOKEN_EXPIRATION = 3600

type TokenData = {
	userId: string
	type: string
}

/**
 * Сервис для восстановления пароля пользователей
 *
 * Предоставляет функциональность для:
 * - Генерации JWT токенов для сброса пароля
 * - Отправки email с ссылкой для сброса пароля
 * - Изменения пароля пользователя с валидацией токена
 *
 * Токены хранятся в Redis с временем жизни 1 час (3600 секунд).
 * После успешного сброса пароля токен удаляется из кэша.
 */
@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly cacheService: CacheService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly prisma: PrismaService
	) {}

	/**
	 * Изменяет пароль пользователя с использованием токена
	 *
	 * Валидирует JWT токен, проверяет его наличие в Redis,
	 * находит пользователя и обновляет его пароль в базе данных.
	 * После успешного изменения пароля токен удаляется из кэша.
	 *
	 * @param token - JWT токен для сброса пароля
	 * @param password - Новый пароль (будет захеширован с помощью Argon2)
	 *
	 * @returns Promise<User> - Обновленные данные пользователя
	 *
	 * @throws {NotFoundException} - Если токен недействителен, истек, отсутствует в кэше или пользователь не найден
	 *
	 * @example
	 * const user = await passwordRecoveryService.changePassword(
	 *   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	 *   "newSecurePassword123"
	 * );
	 */
	public async changePassword(token: string, password: string): Promise<User> {
		try {
			const { userId, type } = await this.jwtService.verifyAsync<TokenData>(
				token,
				{
					ignoreExpiration: true
				}
			)

			if (type !== TOKEN_TYPE)
				throw new NotFoundException(
					"Ссылка недействительна. Запросите новую ссылку для сброса пароля"
				)

			const key = `${FOLDER}:${userId}:${TOKEN_TYPE}`
			const existingToken = await this.cacheService.redis.get(key)

			if (!existingToken)
				throw new NotFoundException(
					"Ссылка недействительна. Запросите новую ссылку для сброса пароля"
				)

			const user = await this.userService.findById(userId)

			if (!user)
				throw new NotFoundException(
					"Пользователь не найден. Запросите новую ссылку для сброса пароля"
				)

			await this.prisma.user.update({
				where: { id: user.id },
				data: { password: await hash(password) }
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
					"Ссылка недействительна. Запросите новую ссылку для сброса пароля"
				)
			}
			throw error
		}
	}

	/**
	 * Отправляет email с ссылкой для сброса пароля
	 *
	 * Генерирует JWT токен, сохраняет его в Redis и отправляет
	 * email с ссылкой, содержащей токен для сброса пароля.
	 *
	 * @param userId - ID пользователя
	 * @param email - Email адрес для отправки письма
	 *
	 * @returns Promise<void> - Успешная отправка email
	 *
	 * @example
	 * await passwordRecoveryService.sendToken(
	 *   "user-id-123",
	 *   "user@example.com"
	 * );
	 */
	public async sendToken(userId: string, email: string): Promise<void> {
		const token = await this.generateToken(userId)

		const subject = "Сброс пароля"
		const url = `${config.ALLOWED_ORIGIN}/auth/password-recovery?token=${token}`

		await this.mailService.sendTemplate(
			VerificationLinkTemplate({
				subject,
				message: "Перейдите по ссылке для сброса пароля",
				url
			}),
			email,
			subject
		)
	}

	/**
	 * Генерирует JWT токен для сброса пароля
	 *
	 * Создает новый JWT токен с типом PASSWORD_RECOVERY и сохраняет
	 * информацию о нем в Redis с временем жизни 1 час.
	 * Если токен уже существует для пользователя, он удаляется перед созданием нового.
	 *
	 * @param userId - ID пользователя
	 *
	 * @returns Promise<string> - JWT токен для сброса пароля
	 *
	 * @example
	 * const token = await passwordRecoveryService.generateToken("user-id-123");
	 * // Возвращает: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 */
	async generateToken(userId: string): Promise<string> {
		const key = `${FOLDER}:${userId}:${TOKEN_TYPE}`
		const existingToken = await this.cacheService.redis.exists(key)

		if (existingToken) await this.cacheService.redis.del(key)

		await this.cacheService.redis.set(
			key,
			JSON.stringify({ userId }),
			"EX",
			TOKEN_EXPIRATION
		)

		return this.jwtService.signAsync({
			userId,
			type: TOKEN_TYPE
		})
	}
}
