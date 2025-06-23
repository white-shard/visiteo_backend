import { MailerService } from "@nestjs-modules/mailer"
import { Injectable } from "@nestjs/common"

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	private sendMail(sendTo: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: sendTo,
			subject,
			html
		})
	}
}
