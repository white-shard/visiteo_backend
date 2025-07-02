import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

/**
 * DTO для установки нового пароля
 *
 * Используется для валидации данных при установке нового пароля
 * с использованием токена сброса пароля.
 *
 * @example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "password": "newSecurePassword123"
 * }
 */
export class NewPasswordDto {
	/**
	 * Новый пароль пользователя
	 *
	 * @type {string}
	 * @description Должен быть строкой, не пустым, от 8 до 48 символов
	 *
	 * @example "newSecurePassword123"
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(48)
	password: string

	/**
	 * JWT токен для сброса пароля
	 *
	 * @type {string}
	 * @description Получен по email, должен быть действительным и не истекшим
	 *
	 * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 */
	@IsString()
	@IsNotEmpty()
	token: string
}
