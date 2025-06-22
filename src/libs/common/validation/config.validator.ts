import { z } from "zod"

import { TIME_STRING_REGEX } from "../constants/regex.constant"
import { ms } from "../utils/ms.util"
import { parseBoolean } from "../utils/parse-boolean.util"

export const configSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),

	APPLICATION_PORT: z.coerce.number().min(1).max(65535).default(3000),
	APPLICATION_URL: z.string().url(),
	ALLOWED_ORIGIN: z.string().url(),

	POSTGRES_URI: z.string().url(),
	REDIS_URI: z.string().url(),

	SESSION_SECRET: z.string().min(1),
	SESSION_NAME: z.string().default("session"),
	SESSION_DOMAIN: z.string().default("localhost"),
	SESSION_MAX_AGE: z
		.string()
		.regex(
			TIME_STRING_REGEX,
			"Must be a valid time string (e.g., '1 hour', '60s', '500 milliseconds')"
		)
		.transform(ms),
	SESSION_HTTP_ONLY: z.string().transform(parseBoolean).default("true"),
	SESSION_SECURE: z.string().transform(parseBoolean).default("false"),
	SESSION_FOLDER: z.string().default("sessions"),

	COOKIES_SECRET: z.string().min(1),

	GOOGLE_RECAPTCHA_SECRET_KEY: z.string().min(1),

	// OAuth
	YANDEX_CLIENT_ID: z.string().min(1),
	YANDEX_CLIENT_SECRET: z.string().min(1),

	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1)
})

export function validateConfig(config: Record<string, unknown>) {
	console.info("🔍 Validating configuration...")
	const result = configSchema.safeParse(config)
	if (!result.success) {
		console.error("❌ Invalid configuration:")
		const errors = result.error.errors
			.map((error) => {
				const field = error.path.join(".")
				return `- [${field}]: ${error.message}`
			})
			.join("\n")

		console.error(errors)
		process.exit(1)
	} else {
		console.info("✅ Configuration validated successfully")
	}
	return result.data
}
