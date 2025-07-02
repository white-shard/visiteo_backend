import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post
} from "@nestjs/common"
import { PasswordRecoveryService } from "./password-recovery.service"
import { Recaptcha } from "@nestlab/google-recaptcha"
import { PasswordRecoveryDto } from "./dto/recovery.dto"
import { UserService } from "@/user/user.service"
import { NewPasswordDto } from "./dto/new-password.dto"
import { TransformResponse } from "@/libs/common/transform/transform.decorator"
import { AuthResponseDto } from "../dto/response/auth-response.dto"
@Controller("auth/password-recovery")
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService,
		private readonly userService: UserService
	) {}

	@Recaptcha()
	@Post()
	@HttpCode(HttpStatus.OK)
	public async reset(@Body() body: PasswordRecoveryDto) {
		const user = await this.userService.findByEmail(body.email)

		if (!user)
			throw new NotFoundException(
				"Пользователь с таким email не найден. Проверьте введенный email и попробуйте снова"
			)

		return this.passwordRecoveryService.sendToken(user.id, body.email)
	}

	@Recaptcha()
	@Post("new-password")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	public async newPassword(@Body() body: NewPasswordDto) {
		return this.passwordRecoveryService.changePassword(
			body.token,
			body.password
		)
	}
}
