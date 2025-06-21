import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from "class-validator"

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
	name: string

	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(64)
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(48)
	password: string
}
