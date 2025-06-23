import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from "@nestjs/common"
import { Recaptcha } from "@nestlab/google-recaptcha"
import { Request, Response } from "express"

import { TransformResponse } from "@/libs/common/transform/transform.decorator"
import { config } from "@/libs/config/app.config"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { AuthResponseDto } from "./dto/response/auth-response.dto"
import { AuthProviderGuard } from "./provider/guards/provider.guard"
import { ProviderService } from "./provider/provider.service"

/**
 * Контроллер для управления аутентификацией пользователей
 *
 * Предоставляет эндпоинты для регистрации, входа, выхода и OAuth авторизации
 * через различные провайдеры (Google, GitHub и т.д.)
 */
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService
	) {}

	/**
	 * Регистрация нового пользователя
	 *
	 * @param req - Express request объект
	 * @param data - Данные для регистрации (email, password, name)
	 * @returns Объект с информацией о пользователе и сессии
	 *
	 * @example
	 * POST /auth/register
	 * {
	 *   "email": "user@example.com",
	 *   "password": "password123",
	 *   "name": "Иван Иванов"
	 * }
	 */
	@Recaptcha()
	@Post("register")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	async register(@Req() req: Request, @Body() data: RegisterDto) {
		return this.authService.register(req, data)
	}

	/**
	 * Вход пользователя в систему
	 *
	 * @param req - Express request объект
	 * @param data - Данные для входа (email, password)
	 * @returns Объект с информацией о пользователе и сессии
	 *
	 * @example
	 * POST /auth/login
	 * {
	 *   "email": "user@example.com",
	 *   "password": "password123"
	 * }
	 */
	@Recaptcha()
	@Post("login")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	async login(@Req() req: Request, @Body() data: LoginDto) {
		return this.authService.login(req, data)
	}

	/**
	 * Callback для OAuth авторизации
	 *
	 * Обрабатывает ответ от OAuth провайдера и создает/обновляет пользователя
	 *
	 * @param req - Express request объект
	 * @param res - Express response объект
	 * @param code - Код авторизации от провайдера
	 * @param provider - Название провайдера (google, github и т.д.)
	 * @returns Редирект на страницу настроек
	 *
	 * @throws BadRequestException если код авторизации не передан
	 */
	@Get("/oauth/callback/:provider")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthProviderGuard)
	async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query("code") code: string,
		@Param("provider") provider: string
	) {
		if (!code) {
			throw new BadRequestException("Не передан код авторизации.")
		}

		await this.authService.extractProfileFromCode(req, provider, code)
		return res.redirect(config.USER_PROFILE_URL)
	}

	/**
	 * Получение URL для подключения OAuth провайдера
	 *
	 * @param provider - Название провайдера (google, github и т.д.)
	 * @returns Объект с URL для авторизации
	 *
	 * @example
	 * GET /auth/oauth/connect/google
	 * Response: { "url": "https://accounts.google.com/oauth/authorize?..." }
	 */
	@Get("/oauth/connect/:provider")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthProviderGuard)
	connect(@Param("provider") provider: string) {
		const instance = this.providerService.findByService(provider)
		return { url: instance?.getAuthUrl() }
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
	 * @example
	 * POST /auth/logout
	 */
	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}
}
