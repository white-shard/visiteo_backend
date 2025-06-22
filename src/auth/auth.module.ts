import { Module } from "@nestjs/common"
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha"

import { getProvidersConfig } from "@/libs/config/providers.config"
import { getRecaptchaConfig } from "@/libs/config/recaptcha.config"
import { UserService } from "@/user/user.service"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { ProviderModule } from "./provider/provider.module"

@Module({
	imports: [
		ProviderModule.registerAsync({
			useFactory: getProvidersConfig
		}),
		GoogleRecaptchaModule.forRoot(getRecaptchaConfig())
	],
	controllers: [AuthController],
	providers: [AuthService, UserService]
})
export class AuthModule {}
