import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"
import { URLSearchParams } from "url"

import { BaseProviderOptionsType } from "./types/base-provider.options.type"
import { TokenResponse } from "./types/responses"
import { UserInfoType } from "./types/user-info.type"

/**
 * Базовый абстрактный класс для OAuth провайдеров
 *
 * Предоставляет общую функциональность для работы с OAuth 2.0 авторизацией:
 * - Генерация URL для авторизации
 * - Обмен кода авторизации на токены
 * - Получение информации о пользователе
 *
 * @template T - Тип данных пользователя от конкретного провайдера
 */
@Injectable()
export abstract class BaseOAuthService<T> {
	private BASE_URL: string

	/**
	 * Создает экземпляр базового OAuth сервиса
	 * @param options - Конфигурация провайдера
	 */
	public constructor(private readonly options: BaseProviderOptionsType) {}

	/**
	 * Абстрактный метод для извлечения информации о пользователе
	 * Должен быть реализован в наследниках для конкретного провайдера
	 *
	 * @param data - Сырые данные пользователя от провайдера
	 * @returns Стандартизированная информация о пользователе
	 */
	protected abstract extractUserInfo(data: T): UserInfoType

	/**
	 * Генерирует URL для авторизации пользователя
	 *
	 * @returns URL для перенаправления пользователя на страницу авторизации
	 */
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

	/**
	 * Находит пользователя по коду авторизации
	 *
	 * Процесс:
	 * 1. Обменивает код авторизации на токены доступа
	 * 2. Получает информацию о пользователе используя токен
	 * 3. Извлекает и стандартизирует данные пользователя
	 *
	 * @param code - Код авторизации полученный от провайдера
	 * @returns Информация о пользователе с токенами
	 * @throws BadRequestException - При ошибке получения токенов
	 * @throws UnauthorizedException - При ошибке получения данных пользователя
	 */
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

	/**
	 * Генерирует URL для перенаправления после авторизации
	 *
	 * @returns URL callback для обработки ответа от провайдера
	 */
	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
	}

	/**
	 * Устанавливает базовый URL приложения
	 * @param value - Базовый URL
	 */
	set baseUrl(value: string) {
		this.BASE_URL = value
	}

	/**
	 * Возвращает название провайдера
	 */
	get name() {
		return this.options.name
	}

	/**
	 * Возвращает URL для получения токенов
	 */
	get access_url() {
		return this.options.access_url
	}

	/**
	 * Возвращает URL для получения профиля пользователя
	 */
	get profile_url() {
		return this.options.profile_url
	}

	/**
	 * Возвращает список запрашиваемых разрешений
	 */
	get scopes() {
		return this.options.scopes
	}
}
