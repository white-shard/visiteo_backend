import { MailerOptions } from "@nestjs-modules/mailer"

import { IS_DEV_MODE } from "../common/utils/is-dev.util"

import { config } from "./app.config"

export function getMailerConfig(): MailerOptions {
	return {
		transport: {
			host: config.SMTP_HOST,
			port: config.SMTP_PORT,
			secure: !IS_DEV_MODE,
			auth: {
				user: config.SMTP_USER,
				pass: config.SMTP_PASSWORD
			}
		},
		defaults: {
			from: `White Shard <${config.SMTP_USER}>`
		}
	}
}
