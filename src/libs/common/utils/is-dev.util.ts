import { config } from "src/libs/config/app.config"

export const IS_DEV_MODE = config.NODE_ENV === "development"
