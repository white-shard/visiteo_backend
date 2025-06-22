import { BaseOAuthService } from "./base-oauth.service"
import { ProviderOptionsType } from "./types/provider-options.type"
import { UserInfoType } from "./types/user-info.type"

export class GoogleOAuthProvider extends BaseOAuthService<GoogleProfile> {
	public constructor(options: ProviderOptionsType) {
		super({
			name: "google",
			authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
			access_url: "https://oauth2.googleapis.com/token",
			profile_url: "https://www.googleapis.com/oauth2/v3/userinfo",
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	public extractUserInfo(data: GoogleProfile): UserInfoType {
		return {
			id: data.sub,
			email: data.email,
			name: data.name,
			picture: data.picture,
			provider: this.name
		}
	}
}

interface GoogleProfile extends Record<string, any> {
	sub: string
	name: string
	given_name: string
	family_name?: string
	picture: string
	email: string
	email_verified: boolean
}
