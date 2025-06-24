import { MailModule } from "@/libs/mail/mail.module"
import { UserModule } from "@/user/user.module"
import { Module } from "@nestjs/common"
import { EmailConfirmationController } from "./email-confirmation.controller"
import { EmailConfirmationService } from "./email-confirmation.service"

@Module({
	imports: [MailModule, UserModule, MailModule],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
