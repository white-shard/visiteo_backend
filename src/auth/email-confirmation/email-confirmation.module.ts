import { MailModule } from "@/libs/mail/mail.module"
import { UserModule } from "@/user/user.module"
import { forwardRef, Module } from "@nestjs/common"
import { AuthModule } from "../auth.module"
import { EmailConfirmationController } from "./email-confirmation.controller"
import { EmailConfirmationService } from "./email-confirmation.service"

/**
 * Модуль подтверждения email адреса
 *
 * Предоставляет функциональность для:
 * - Отправки писем с подтверждением email
 * - Обработки подтверждения email адреса
 * - Интеграции с системой аутентификации
 *
 * Зависимости:
 * - MailModule - для отправки email писем
 * - UserModule - для работы с пользователями
 * - AuthModule - для интеграции с системой аутентификации
 */
@Module({
	imports: [MailModule, UserModule, MailModule, forwardRef(() => AuthModule)],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
