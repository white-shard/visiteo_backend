import * as dotenv from "dotenv"
import * as dotenvExpand from "dotenv-expand"

import { validateConfig } from "../common/validation/config.validator"

const APPLICATION_ENV = dotenvExpand.expand(dotenv.config()).parsed
export const config = validateConfig(APPLICATION_ENV as Record<string, unknown>)
