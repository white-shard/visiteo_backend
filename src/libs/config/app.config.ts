import { configSchema } from "../common/validation/config.validator"

export const config = configSchema.parse(process.env)
