/**
 * Опции провайдера аутентификации
 * Содержит минимальные параметры для настройки OAuth провайдера
 */
export type ProviderOptionsType = {
	/** Массив запрашиваемых разрешений (scopes) */
	scopes: string[]
	/** Идентификатор клиента (Client ID) */
	client_id: string
	/** Секретный ключ клиента (Client Secret) */
	client_secret: string
}
