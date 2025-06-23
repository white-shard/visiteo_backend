/**
 * Ответ с токенами доступа от OAuth провайдера
 * Содержит информацию о токенах и времени их действия
 */
export type TokenResponse = {
	/** Токен доступа для авторизации запросов */
	access_token: string
	/** Токен обновления для получения нового access token */
	refresh_token: string
	/** Время истечения токена в формате timestamp */
	expires_at: number
	/** Время жизни токена в секундах */
	expires_in: number
}
