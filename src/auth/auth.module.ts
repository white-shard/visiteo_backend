import { Module } from "@nestjs/common"
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha"

import { getRecaptchaConfig } from "@/libs/config/recaptcha.config"
import { UserService } from "@/user/user.service"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Module({
	imports: [GoogleRecaptchaModule.forRoot(getRecaptchaConfig())],
	controllers: [AuthController],
	providers: [AuthService, UserService]
})
export class AuthModule {}
