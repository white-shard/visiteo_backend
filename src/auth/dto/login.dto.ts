import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from "class-validator"

export class LoginDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@IsOptional()
	@IsString()
	code: string
}
