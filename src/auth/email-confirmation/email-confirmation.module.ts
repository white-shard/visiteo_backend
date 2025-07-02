import { MailModule } from "@/libs/mail/mail.module"
import { UserModule } from "@/user/user.module"
import { forwardRef, Module } from "@nestjs/common"
import { AuthModule } from "../auth.module"
import { EmailConfirmationController } from "./email-confirmation.controller"
import { EmailConfirmationService } from "./email-confirmation.service"
import { config } from "@/libs/config/app.config"
import { JwtModule } from "@nestjs/jwt"

/**
 * Модуль подтверждения email адреса
 *
 * Предоставляет функциональность для:
 * - Отправки писем с подтверждением email через MailModule
 * - Обработки подтверждения email адреса через контроллер
 * - Интеграции с системой аутентификации через AuthModule
 * - Генерации и верификации JWT токенов через JwtModule
 * - Управления пользователями через UserModule
 *
 * Зависимости:
 * - MailModule - для отправки email писем с шаблонами
 * - UserModule - для работы с пользователями и их данными
 * - AuthModule - для интеграции с системой аутентификации и создания сессий
 * - JwtModule - для генерации и верификации JWT токенов с секретным ключом
 *
 * Конфигурация:
 * - JWT секрет берется из config.VERIFICATION_SECRET
 * - Токены имеют ограниченное время жизни (1 час)
 * - Токены хранятся в Redis кэше
 *
 * Экспорты:
 * - EmailConfirmationService - для использования в других модулях
 */
@Module({
	imports: [
		MailModule,
		UserModule,
		forwardRef(() => AuthModule),
		JwtModule.register({ secret: config.VERIFICATION_SECRET })
	],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
