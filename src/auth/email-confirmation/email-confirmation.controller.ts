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
import { ConfirmationDto } from "./dto/confirmation.dto"
import { EmailConfirmationService } from "./email-confirmation.service"

@Controller("verification")
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly authService: AuthService
	) {}

	@Post("email")
	@HttpCode(HttpStatus.OK)
	public async verifyEmail(@Req() req: Request, @Body() body: ConfirmationDto) {
		const user = await this.emailConfirmationService.verifyToken(body.token)

		return this.authService.saveSession(req, user)
	}
}
