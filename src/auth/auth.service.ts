import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import { User } from "@prisma/__generated__"
import { verify } from "argon2"
import { Request, Response } from "express"

import { config } from "@/libs/config/app.config"
import { PrismaService } from "@/prisma/prisma.service"
import { UserService } from "@/user/user.service"

import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { ProviderService } from "./provider/provider.service"

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly providerService: ProviderService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException("Пользователь с таким email уже существует")
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			"",
			false
		)

		return this.saveSession(req, newUser)
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !dto.password) {
			throw new NotFoundException("Неверный email или пароль")
		}

		const isPasswordValid = user?.password
			? await verify(user.password, dto.password)
			: false

		if (!isPasswordValid) {
			throw new NotFoundException("Неверный email или пароль")
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if (err) {
					reject(
						new InternalServerErrorException(
							"Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена"
						)
					)
				}
				res.clearCookie(config.SESSION_NAME)
				resolve()
			})
		})
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const instance = this.providerService.findByService(provider)

		if (!instance) {
			throw new NotFoundException("Не удалось найти провайдер")
		}

		const profile = await instance.findUserByCode(code)

		const account = await this.prisma.account.findFirst({
			where: {
				clientId: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user = await this.userService.findByEmail(profile.email)

		if (!user)
			user = await this.userService.create(
				profile.email,
				"",
				profile.name,
				profile.picture,
				true
			)

		if (!account) {
			await this.prisma.account.create({
				data: {
					type: "oauth",
					userId: user.id,
					clientId: profile.id,
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at
				}
			})
		}

		return this.saveSession(req, user)
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save((err) => {
				if (err) {
					reject(
						new InternalServerErrorException("Ошибка при сохранении сессии")
					)
				}
				resolve({ user })
			})
		})
	}
}
