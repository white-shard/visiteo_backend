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
 * Обрабатывает запросы на верификацию email токенов
 */
@Controller("verification")
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly authService: AuthService
	) {}

	/**
	 * Подтверждает email адрес пользователя по токену
	 * @param req - Express request объект
	 * @param body - DTO с токеном подтверждения
	 * @returns Сессия пользователя после успешной верификации
	 */
	@Post("email")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	public async verifyEmail(@Req() req: Request, @Body() body: ConfirmationDto) {
		const user = await this.emailConfirmationService.verifyToken(body.token)

		return this.authService.saveSession(req, user)
	}
}
