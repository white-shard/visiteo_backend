import { BaseOAuthService } from "./base-oauth.service"
import { ProviderOptionsType } from "./types/provider-options.type"
import { UserInfoType } from "./types/user-info.type"

/**
 * OAuth провайдер для аутентификации через Google
 *
 * Предоставляет функциональность для авторизации пользователей через Google OAuth 2.0.
 * Использует Google+ API для получения профиля пользователя.
 *
 * @example
 * ```typescript
 * const googleProvider = new GoogleOAuthProvider({
 *   client_id: "your-google-client-id",
 *   client_secret: "your-google-client-secret",
 *   scopes: ["openid", "email", "profile"]
 * });
 * ```
 */
export class GoogleOAuthProvider extends BaseOAuthService<GoogleProfile> {
	/**
	 * Создает новый экземпляр Google OAuth провайдера
	 *
	 * @param options - Конфигурационные параметры провайдера
	 * @param options.client_id - Google Client ID из Google Cloud Console
	 * @param options.client_secret - Google Client Secret из Google Cloud Console
	 * @param options.scopes - Массив разрешений для доступа к данным пользователя
	 */
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

	/**
	 * Извлекает информацию о пользователе из профиля Google
	 *
	 * Преобразует данные профиля Google в стандартный формат UserInfoType.
	 *
	 * @param data - Профиль пользователя от Google API
	 * @returns Стандартизированная информация о пользователе
	 *
	 * @example
	 * ```typescript
	 * const userInfo = googleProvider.extractUserInfo(googleProfileData);
	 * // userInfo = {
	 * //   id: "123456789",
	 * //   email: "user@gmail.com",
	 * //   name: "John Doe",
	 * //   picture: "https://lh3.googleusercontent.com/...",
	 * //   provider: "google"
	 * // }
	 * ```
	 */
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

/**
 * Интерфейс профиля пользователя Google
 *
 * Описывает структуру данных, возвращаемых Google OAuth API
 */
interface GoogleProfile extends Record<string, any> {
	/** Уникальный идентификатор пользователя в Google */
	sub: string
	/** Полное имя пользователя */
	name: string
	/** Имя пользователя */
	given_name: string
	/** Фамилия пользователя (опционально) */
	family_name?: string
	/** URL аватара пользователя */
	picture: string
	/** Email адрес пользователя */
	email: string
	/** Подтвержден ли email адрес */
	email_verified: boolean
}
