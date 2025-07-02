import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class PasswordRecoveryDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(64)
	email: string
}
