import * as dotenv from "dotenv"

import { config } from "@/libs/config/app.config"

dotenv.config()

export const IS_DEV_ENV = config.NODE_ENV === "development"
