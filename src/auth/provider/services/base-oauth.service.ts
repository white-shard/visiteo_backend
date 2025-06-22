import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"
import { URLSearchParams } from "url"

import { BaseProviderOptionsType } from "./types/base-provider.options.type"
import { TokenResponse } from "./types/responses"
import { UserInfoType } from "./types/user-info.type"

@Injectable()
export abstract class BaseOAuthService<T> {
	private BASE_URL: string

	public constructor(private readonly options: BaseProviderOptionsType) {}

	protected abstract extractUserInfo(data: T): UserInfoType

	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: "code",
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(" "),
			access_type: "offline",
			prompt: "select_account"
		})

		return `${this.options.authorize_url}?${query.toString()}`
	}

	public async findUserByCode(code: string): Promise<UserInfoType> {
		const client_id = this.options.client_id
		const client_secret = this.options.client_secret

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			redirect_uri: this.getRedirectUrl(),
			grant_type: "authorization_code",
			code
		})

		const tokenResponse = await fetch(this.options.access_url, {
			method: "POST",
			body: tokenQuery,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json"
			}
		})

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text()
			throw new BadRequestException(
				`Не удалось получить токен с ${this.options.access_url}. Статус: ${tokenResponse.status}. Ответ: ${errorText}`
			)
		}

		const tokenData = (await tokenResponse.json()) as TokenResponse

		if (!tokenData.access_token) {
			throw new BadRequestException(
				`Нет токенов с ${this.options.access_url}. Убедитесь, что код авторизации действителен.`
			)
		}

		const userResponse = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		})

		if (!userResponse.ok) {
			const errorText = await userResponse.text()
			throw new UnauthorizedException(
				`Не удалось получить пользователя с ${this.options.profile_url}. Статус: ${userResponse.status}. Ответ: ${errorText}`
			)
		}

		const user = (await userResponse.json()) as T
		const userData = this.extractUserInfo(user)

		return {
			...userData,
			access_token: tokenData.access_token,
			refresh_token: tokenData.refresh_token,
			expires_at: tokenData.expires_at || tokenData.expires_in,
			provider: this.options.name
		}
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
	}

	set baseUrl(value: string) {
		this.BASE_URL = value
	}

	get name() {
		return this.options.name
	}

	get access_url() {
		return this.options.access_url
	}

	get profile_url() {
		return this.options.profile_url
	}

	get scopes() {
		return this.options.scopes
	}
}
