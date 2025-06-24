import { OptionsType } from "src/auth/provider/provider.constants"
import { GoogleOAuthProvider } from "src/auth/provider/services/google.provider"
import { YandexOAuthProvider } from "src/auth/provider/services/yandex.provider"

import { config } from "./app.config"

export const getProvidersConfig = (): OptionsType => ({
	baseUrl: config.APPLICATION_URL,
	services: [
		new YandexOAuthProvider({
			client_id: config.YANDEX_CLIENT_ID,
			client_secret: config.YANDEX_CLIENT_SECRET,
			scopes: ["login:email", "login:avatar", "login:info"]
		}),
		new GoogleOAuthProvider({
			client_id: config.GOOGLE_CLIENT_ID,
			client_secret: config.GOOGLE_CLIENT_SECRET,
			scopes: ["email", "profile"]
		})
	]
})
