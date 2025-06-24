import { Expose, Type } from "class-transformer"

import { UserResponseDto } from "src/user/dto/response/user-response.dto"

/**
 * DTO для ответа аутентификации
 * Содержит информацию о пользователе после успешной авторизации
 */
export class AuthResponseDto {
	/**
	 * Информация о пользователе
	 * @type {UserResponseDto}
	 */
	@Expose()
	@Type(() => UserResponseDto)
	user: UserResponseDto

	/**
	 * Сообщение для пользователя
	 * @type {string}
	 */
	@Expose()
	message: string
}
