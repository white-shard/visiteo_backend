/**
 * Базовые опции провайдера аутентификации
 * Содержит все необходимые параметры для настройки OAuth провайдера
 */
export type BaseProviderOptionsType = {
	/** Название провайдера (например: "google", "github", "facebook") */
	name: string
	/** URL для авторизации пользователя */
	authorize_url: string
	/** URL для получения access token */
	access_url: string
	/** URL для получения профиля пользователя */
	profile_url: string
	/** Массив запрашиваемых разрешений (scopes) */
	scopes: string[]
	/** Идентификатор клиента (Client ID) */
	client_id: string
	/** Секретный ключ клиента (Client Secret) */
	client_secret: string
}
