import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from "class-validator"

export class LoginDto {
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

	@IsOptional()
	@IsString()
	@MaxLength(6)
	code: string
}
