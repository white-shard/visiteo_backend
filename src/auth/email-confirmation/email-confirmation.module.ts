import { MailModule } from "@/libs/mail/mail.module"
import { Module } from "@nestjs/common"
import { EmailConfirmationController } from "./email-confirmation.controller"
import { EmailConfirmationService } from "./email-confirmation.service"
import { UserModule } from "@/user/user.module"

@Module({
	imports: [MailModule, UserModule, MailModule],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
