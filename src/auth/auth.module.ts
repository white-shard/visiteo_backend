import { forwardRef, Module } from "@nestjs/common"
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha"

import { getProvidersConfig } from "src/libs/config/providers.config"
import { getRecaptchaConfig } from "src/libs/config/recaptcha.config"
import { UserService } from "src/user/user.service"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { EmailConfirmationModule } from "./email-confirmation/email-confirmation.module"
import { ProviderModule } from "./provider/provider.module"
import { PasswordRecoveryModule } from "./password-recovery/password-recovery.module"

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
 * - EmailConfirmationModule - для подтверждения email
 * - PasswordRecoveryModule - для восстановления пароля
 */
@Module({
	imports: [
		ProviderModule.registerAsync({
			useFactory: getProvidersConfig
		}),
		GoogleRecaptchaModule.forRoot(getRecaptchaConfig()),
		forwardRef(() => EmailConfirmationModule),
		PasswordRecoveryModule
	],
	controllers: [AuthController],
	providers: [AuthService, UserService],
	exports: [AuthService]
})
export class AuthModule {}
