import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

/**
 * DTO для запроса сброса пароля
 *
 * Используется для валидации данных при запросе отправки email
 * с ссылкой для сброса пароля.
 *
 * @example
 * {
 *   "email": "user@example.com"
 * }
 */
export class PasswordRecoveryDto {
	/**
	 * Email пользователя для отправки ссылки сброса пароля
	 *
	 * @type {string}
	 * @description Должен быть валидным email адресом, не пустым и не более 64 символов
	 *
	 * @example "user@example.com"
	 */
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(64)
	email: string
}
