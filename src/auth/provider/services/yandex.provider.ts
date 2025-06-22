import { BaseOAuthService } from "./base-oauth.service"
import { ProviderOptionsType } from "./types/provider-options.type"
import { UserInfoType } from "./types/user-info.type"

export class YandexOAuthProvider extends BaseOAuthService<YandexProfile> {
	public constructor(options: ProviderOptionsType) {
		super({
			name: "yandex",
			authorize_url: "https://oauth.yandex.ru/authorize",
			access_url: "https://oauth.yandex.ru/token",
			profile_url: "https://login.yandex.ru/info?format=json",
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	public extractUserInfo(data: YandexProfile): UserInfoType {
		return {
			id: data.id,
			email: data.default_email || data.emails?.[0] || "",
			name: data.display_name || "",
			picture: data.default_avatar_id
				? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
				: "",
			provider: this.name
		}
	}
}

interface YandexProfile extends Record<string, any> {
	id: string
	login: string
	client_id: string
	display_name?: string
	real_name?: string
	first_name?: string
	last_name?: string
	sex?: "male" | "female" | null
	default_email?: string
	emails?: string[]
	default_avatar_id?: string
	is_avatar_empty?: boolean
	psuid: string
}
