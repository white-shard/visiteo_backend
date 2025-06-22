import { GoogleRecaptchaModuleOptions } from "@nestlab/google-recaptcha"

import { IS_DEV_MODE } from "../common/utils/is-dev.util"

import { config } from "./app.config"

export function getRecaptchaConfig(): GoogleRecaptchaModuleOptions {
	return {
		secretKey: config.GOOGLE_RECAPTCHA_SECRET_KEY,
		response: (req: { headers: { recaptcha: string } }) =>
			req.headers.recaptcha,
		skipIf: IS_DEV_MODE
	}
}
