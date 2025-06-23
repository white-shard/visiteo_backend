import { MailerModule } from "@nestjs-modules/mailer"
import { Module } from "@nestjs/common"

import { getMailerConfig } from "../config/mailer.config"

import { MailService } from "./mail.service"

@Module({
	imports: [MailerModule.forRoot(getMailerConfig())],
	providers: [MailService]
})
export class MailModule {}
