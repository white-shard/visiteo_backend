import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from "class-validator"

/**
 * DTO для входа в систему
 * Используется для аутентификации пользователей
 */
export class LoginDto {
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

	/**
	 * Код двухфакторной аутентификации (опционально)
	 * @type {string}
	 * @maxLength 6 символов
	 * @optional
	 */
	@IsOptional()
	@IsString()
	@MaxLength(6)
	code: string
}
