import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from "@nestjs/common"
import { Recaptcha } from "@nestlab/google-recaptcha"
import { Request, Response } from "express"

import { TransformResponse } from "@/libs/common/transform/transform.decorator"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { AuthResponseDto } from "./dto/response/auth-response.dto"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Recaptcha()
	@Post("register")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	async register(@Req() req: Request, @Body() data: RegisterDto) {
		return this.authService.register(req, data)
	}

	@Recaptcha()
	@Post("login")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	async login(@Req() req: Request, @Body() data: LoginDto) {
		return this.authService.login(req, data)
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}
}
