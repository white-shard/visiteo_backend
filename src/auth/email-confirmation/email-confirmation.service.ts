import { CacheService } from "@/libs/cache/cache.service"
import { config } from "@/libs/config/app.config"
import { MailService } from "@/libs/mail/mail.service"
import { VerificationLinkTemplate } from "@/libs/mail/templates/verification-link.template"
import { PrismaService } from "@/prisma/prisma.service"
import { UserService } from "@/user/user.service"
import { Injectable, NotFoundException } from "@nestjs/common"
import { User } from "@prisma/__generated__"
import cuid from "cuid"

const FOLDER = config.TOKENS_FOLDER
const TOKEN_TYPE = "EMAIL_VERIFICATION"
const TOKEN_EXPIRATION = 3600

@Injectable()
export class EmailConfirmationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cacheService: CacheService,
		private readonly userService: UserService,
		private readonly mailService: MailService
	) {}

	public async verifyToken(token: string): Promise<User> {
		const key = `${FOLDER}:*:${TOKEN_TYPE}:${token}`
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

		await this.cacheService.redis.del(
			`${FOLDER}:${user.id}:${TOKEN_TYPE}:${token}`
		)

		return user
	}

	public async sendToken(userId: string, email: string) {
		const token = await this.generateVerificationToken(userId, email)

		const subject = "Подтверждение электронной почты"
		const url = `${config.ALLOWED_ORIGIN}/verify/${token}`

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

	async generateVerificationToken(userId: string, email: string) {
		const token = cuid()

		const key = `${FOLDER}:${userId}:${TOKEN_TYPE}:*`
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
