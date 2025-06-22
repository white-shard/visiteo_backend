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

/**
 * Сервис аутентификации
 *
 * Отвечает за:
 * - Регистрацию новых пользователей
 * - Вход пользователей с проверкой пароля
 * - Выход и управление сессиями
 * - OAuth авторизацию через внешние провайдеры
 * - Создание и сохранение пользовательских сессий
 */
@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly providerService: ProviderService
	) {}

	/**
	 * Регистрация нового пользователя
	 *
	 * Проверяет уникальность email, создает пользователя и сохраняет сессию
	 *
	 * @param req - Express request объект для работы с сессией
	 * @param dto - Данные для регистрации
	 * @returns Promise с объектом пользователя и сессией
	 *
	 * @throws ConflictException если пользователь с таким email уже существует
	 */
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

	/**
	 * Вход пользователя в систему
	 *
	 * Проверяет email и пароль, создает сессию при успешной авторизации
	 *
	 * @param req - Express request объект для работы с сессией
	 * @param dto - Данные для входа
	 * @returns Promise с объектом пользователя и сессией
	 *
	 * @throws NotFoundException если пользователь не найден или пароль неверный
	 */
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

	/**
	 * Выход пользователя из системы
	 *
	 * Уничтожает сессию и очищает cookies
	 *
	 * @param req - Express request объект
	 * @param res - Express response объект
	 * @returns Promise<void>
	 *
	 * @throws InternalServerErrorException если не удалось уничтожить сессию
	 */
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

	/**
	 * Извлечение профиля пользователя из OAuth кода
	 *
	 * Получает профиль от провайдера, ищет или создает пользователя,
	 * связывает аккаунт с провайдером и создает сессию
	 *
	 * @param req - Express request объект для работы с сессией
	 * @param provider - Название OAuth провайдера
	 * @param code - Код авторизации от провайдера
	 * @returns Promise с объектом пользователя и сессией
	 *
	 * @throws NotFoundException если провайдер не найден
	 */
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

	/**
	 * Сохранение пользовательской сессии
	 *
	 * Сохраняет ID пользователя в сессии
	 *
	 * @param req - Express request объект
	 * @param user - Объект пользователя
	 * @returns Promise с объектом пользователя
	 *
	 * @throws InternalServerErrorException если не удалось сохранить сессию
	 */
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
