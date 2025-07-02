import { forwardRef, Module } from "@nestjs/common"
import { PasswordRecoveryService } from "./password-recovery.service"
import { PasswordRecoveryController } from "./password-recovery.controller"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "@/user/user.module"
import { config } from "@/libs/config/app.config"
import { AuthModule } from "../auth.module"
import { MailModule } from "@/libs/mail/mail.module"

/**
 * Модуль восстановления пароля пользователей
 *
 * Предоставляет функциональность для безопасного сброса паролей через email
 * с временными JWT токенами (время жизни: 1 час).
 *
 * ## API Endpoints:
 *
 * - `POST /auth/password-recovery` - Запрос сброса пароля
 * - `POST /auth/password-recovery/new-password` - Установка нового пароля
 *
 * ## Зависимости:
 *
 * - **MailModule**: Отправка email-уведомлений
 * - **UserModule**: Работа с пользователями
 * - **AuthModule**: Интеграция с системой аутентификации
 * - **JwtModule**: Генерация и валидация токенов
 *
 * ## Безопасность:
 *
 * - JWT токены с ограниченным временем жизни
 * - Хеширование паролей (Argon2)
 * - Кэширование в Redis
 * - Защита reCAPTCHA
 *
 * @see PasswordRecoveryService
 * @see PasswordRecoveryController
 */
@Module({
	imports: [
		MailModule,
		UserModule,
		forwardRef(() => AuthModule),
		JwtModule.register({ secret: config.VERIFICATION_SECRET })
	],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
