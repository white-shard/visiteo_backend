import { Module } from "@nestjs/common"
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha"

import { getProvidersConfig } from "@/libs/config/providers.config"
import { getRecaptchaConfig } from "@/libs/config/recaptcha.config"
import { UserService } from "@/user/user.service"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { ProviderModule } from "./provider/provider.module"

/**
 * Модуль аутентификации
 *
 * Предоставляет функциональность для:
 * - Регистрации и входа пользователей
 * - OAuth авторизации через различные провайдеры
 * - Управления сессиями
 * - Защиты от ботов через Google reCAPTCHA
 *
 * Зависимости:
 * - ProviderModule - для работы с OAuth провайдерами
 * - GoogleRecaptchaModule - для защиты форм от ботов
 * - UserService - для работы с пользователями
 */
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
