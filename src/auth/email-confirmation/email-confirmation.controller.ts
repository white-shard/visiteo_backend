import { TransformResponse } from "@/libs/common/transform/transform.decorator"
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from "@nestjs/common"
import { Request } from "express"
import { AuthService } from "../auth.service"
import { AuthResponseDto } from "../dto/response/auth-response.dto"
import { ConfirmationDto } from "./dto/confirmation.dto"
import { EmailConfirmationService } from "./email-confirmation.service"

/**
 * Контроллер для подтверждения email адреса пользователя
 *
 * Обрабатывает запросы на верификацию email токенов и предоставляет
 * функциональность для завершения процесса регистрации пользователя.
 *
 * Маршруты:
 * - POST /verification/email - Подтверждение email адреса по токену
 *
 * После успешного подтверждения email пользователь автоматически
 * авторизуется в системе и получает сессию.
 */
@Controller("verification")
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly authService: AuthService
	) {}

	/**
	 * Подтверждает email адрес пользователя по токену
	 *
	 * Процесс подтверждения:
	 * 1. Валидирует входящий токен через EmailConfirmationService
	 * 2. Активирует пользователя (устанавливает isEnabled = true)
	 * 3. Обновляет email адрес пользователя
	 * 4. Создает сессию пользователя через AuthService
	 * 5. Возвращает данные авторизованного пользователя
	 *
	 * @param req - Express request объект для создания сессии
	 * @param body - DTO с токеном подтверждения email
	 * @returns AuthResponseDto - Данные авторизованного пользователя с сессией
	 * @throws NotFoundException - Если токен недействителен или пользователь не найден
	 * @throws BadRequestException - Если токен отсутствует или имеет неверный формат
	 * @throws UnauthorizedException - При ошибках авторизации
	 *
	 * @example
	 * POST /verification/email
	 * {
	 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 * }
	 */
	@Post("email")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	public async verifyEmail(@Req() req: Request, @Body() body: ConfirmationDto) {
		const user = await this.emailConfirmationService.verifyToken(body.token)

		return this.authService.saveSession(req, user)
	}
}
