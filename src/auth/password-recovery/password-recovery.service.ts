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

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly cacheService: CacheService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly prisma: PrismaService
	) {}

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
