import { z } from "zod"

const configSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	APPLICATION_PORT: z.coerce.number().min(1).max(65535).default(3000),
	APPLICATION_URL: z.string().url(),
	ALLOWED_ORIGIN: z.string().url(),
	POSTGRES_URI: z.string().url(),
	REDIS_URI: z.string().url()
})

export function validateConfig(config: Record<string, unknown>) {
	const result = configSchema.safeParse(config)
	if (!result.success) {
		const errors = result.error.errors
			.map((error) => {
				const field = error.path.join(".")
				return `❌ [${field}]: ${error.message}`
			})
			.join("\n")

		console.error(errors)
		process.exit(1)
	}
	return result.data
}
