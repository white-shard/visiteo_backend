import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from "class-validator"

/**
 * DTO для регистрации пользователя
 * Используется для создания новых аккаунтов
 */
export class RegisterDto {
	/**
	 * Имя пользователя
	 * @type {string}
	 * @maxLength 32 символа
	 */
	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
	name: string

	/**
	 * Email пользователя
	 * @type {string}
	 * @maxLength 64 символа
	 */
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(64)
	email: string

	/**
	 * Пароль пользователя
	 * @type {string}
	 * @minLength 8 символов
	 * @maxLength 48 символов
	 */
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(48)
	password: string
}
