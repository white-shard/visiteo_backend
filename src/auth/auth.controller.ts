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

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService
	) {}

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
		return res.redirect(`${config.ALLOWED_ORIGIN}/dashboard/settings`)
	}

	@Get("/oauth/connect/:provider")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthProviderGuard)
	connect(@Param("provider") provider: string) {
		const instance = this.providerService.findByService(provider)
		return { url: instance?.getAuthUrl() }
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}
}
