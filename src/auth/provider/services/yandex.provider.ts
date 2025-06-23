import { BaseOAuthService } from "./base-oauth.service"
import { ProviderOptionsType } from "./types/provider-options.type"
import { UserInfoType } from "./types/user-info.type"

/**
 * OAuth провайдер для аутентификации через Yandex
 *
 * Предоставляет функциональность для авторизации пользователей через Yandex OAuth.
 * Использует Yandex Passport API для получения профиля пользователя.
 *
 * @example
 * ```typescript
 * const yandexProvider = new YandexOAuthProvider({
 *   client_id: "your-yandex-client-id",
 *   client_secret: "your-yandex-client-secret",
 *   scopes: ["login:info", "login:email", "login:avatar"]
 * });
 * ```
 */
export class YandexOAuthProvider extends BaseOAuthService<YandexProfile> {
	/**
	 * Создает новый экземпляр Yandex OAuth провайдера
	 *
	 * @param options - Конфигурационные параметры провайдера
	 * @param options.client_id - Yandex Client ID из Yandex OAuth
	 * @param options.client_secret - Yandex Client Secret из Yandex OAuth
	 * @param options.scopes - Массив разрешений для доступа к данным пользователя
	 */
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

	/**
	 * Извлекает информацию о пользователе из профиля Yandex
	 *
	 * Преобразует данные профиля Yandex в стандартный формат UserInfoType.
	 * Автоматически формирует URL аватара на основе default_avatar_id.
	 *
	 * @param data - Профиль пользователя от Yandex API
	 * @returns Стандартизированная информация о пользователе
	 *
	 * @example
	 * ```typescript
	 * const userInfo = yandexProvider.extractUserInfo(yandexProfileData);
	 * // userInfo = {
	 * //   id: "123456789",
	 * //   email: "user@yandex.ru",
	 * //   name: "Иван Иванов",
	 * //   picture: "https://avatars.yandex.net/get-yapic/12345/islands-200",
	 * //   provider: "yandex"
	 * // }
	 * ```
	 */
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

/**
 * Интерфейс профиля пользователя Yandex
 *
 * Описывает структуру данных, возвращаемых Yandex OAuth API
 */
interface YandexProfile extends Record<string, any> {
	/** Уникальный идентификатор пользователя в Yandex */
	id: string
	/** Логин пользователя */
	login: string
	/** ID клиентского приложения */
	client_id: string
	/** Отображаемое имя пользователя */
	display_name?: string
	/** Реальное имя пользователя */
	real_name?: string
	/** Имя пользователя */
	first_name?: string
	/** Фамилия пользователя */
	last_name?: string
	/** Пол пользователя */
	sex?: "male" | "female" | null
	/** Основной email адрес */
	default_email?: string
	/** Массив всех email адресов пользователя */
	emails?: string[]
	/** ID аватара по умолчанию */
	default_avatar_id?: string
	/** Пустой ли аватар */
	is_avatar_empty?: boolean
	/** Уникальный идентификатор сессии */
	psuid: string
}
