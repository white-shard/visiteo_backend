import { MailModule } from "@/libs/mail/mail.module"
import { UserModule } from "@/user/user.module"
import { forwardRef, Module } from "@nestjs/common"
import { AuthModule } from "../auth.module"
import { EmailConfirmationController } from "./email-confirmation.controller"
import { EmailConfirmationService } from "./email-confirmation.service"

@Module({
	imports: [MailModule, UserModule, MailModule, forwardRef(() => AuthModule)],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
