import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from "@nestjs/common"
import { Request, Response } from "express"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	@HttpCode(HttpStatus.OK)
	async register(@Req() req: Request, @Body() data: RegisterDto) {
		return this.authService.register(req, data)
	}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	async login(@Req() req: Request, @Body() data: LoginDto) {
		return this.authService.login(req, data)
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}
}
