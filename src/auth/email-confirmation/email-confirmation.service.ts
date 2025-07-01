import { CacheService } from "@/libs/cache/cache.service"
import { config } from "@/libs/config/app.config"
import { MailService } from "@/libs/mail/mail.service"
import { VerificationLinkTemplate } from "@/libs/mail/templates/verification-link.template"
import { PrismaService } from "@/prisma/prisma.service"
import { UserService } from "@/user/user.service"
import { Injectable, NotFoundException } from "@nestjs/common"
import { User } from "@prisma/__generated__"
import * as cuid from "cuid"

const FOLDER = config.TOKENS_FOLDER
const TOKEN_TYPE = "EMAIL"
const TOKEN_EXPIRATION = 3600

/**
 * Сервис для подтверждения электронной почты пользователей
 *
 * Предоставляет функциональность для:
 * - Генерации токенов подтверждения
 * - Отправки писем с ссылками для подтверждения
 * - Верификации токенов и активации пользователей
 */
@Injectable()
export class EmailConfirmationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cacheService: CacheService,
		private readonly userService: UserService,
		private readonly mailService: MailService
	) {}

	/**
	 * Верифицирует токен подтверждения и активирует пользователя
	 *
	 * @param token - Токен подтверждения из ссылки
	 * @returns Promise<User> - Обновленный пользователь с подтвержденным email
	 * @throws NotFoundException - Если токен недействителен или пользователь не найден
	 */
	public async verifyToken(token: string): Promise<User> {
		const pattern = `${FOLDER}:*:${TOKEN_TYPE}:${token}`
		const keys = await this.cacheService.redis.keys(pattern)

		if (keys.length === 0)
			throw new NotFoundException(
				"Ссылка недействительна. Запросите новую ссылку для подтверждения"
			)

		const key = keys[0]
		const existingToken = await this.cacheService.redis.get(key)

		if (!existingToken)
			throw new NotFoundException(
				"Ссылка недействительна. Запросите новую ссылку для подтверждения"
			)

		const data = JSON.parse(existingToken) as { userId: string; email: string }

		const user = await this.userService.findById(data.userId)

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
	}

	/**
	 * Отправляет письмо с токеном подтверждения на указанный email
	 *
	 * @param userId - ID пользователя
	 * @param email - Email адрес для подтверждения
	 * @returns Promise<void>
	 */
	public async sendToken(userId: string, email: string) {
		const token = await this.generateVerificationToken(userId, email)

		const subject = "Подтверждение электронной почты"
		const url = `${config.ALLOWED_ORIGIN}/verify?type=${TOKEN_TYPE}
		&token=${token}`

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
	 * @param userId - ID пользователя
	 * @param email - Email адрес для подтверждения
	 * @returns Promise<string> - Сгенерированный токен
	 */
	async generateVerificationToken(userId: string, email: string) {
		const token = cuid()

		const key = `${FOLDER}:${userId}:${TOKEN_TYPE}:${token}`
		const existingToken = await this.cacheService.redis.exists(key)

		if (existingToken) await this.cacheService.redis.del(key)

		await this.cacheService.redis.set(
			key,
			JSON.stringify({ userId, email }),
			"EX",
			TOKEN_EXPIRATION
		)

		return token
	}
}
