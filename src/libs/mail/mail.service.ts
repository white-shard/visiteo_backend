import { MailerService } from "@nestjs-modules/mailer"
import { Injectable } from "@nestjs/common"
import { render } from '@react-email/components'

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	public async sendTemplate(template: React.JSX.Element, sendTo: string, subject: string): Promise<unknown> {
		try {
			const html = await render(template)
			return this.sendMail(sendTo, subject, html)
		} catch (error) {
			console.error(error)
		}
	}

	private sendMail(sendTo: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: sendTo,
			subject,
			html
		})
	}
}
