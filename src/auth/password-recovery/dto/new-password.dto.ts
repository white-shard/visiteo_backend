import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class NewPasswordDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(48)
	password: string

	@IsString()
	@IsNotEmpty()
	token: string
}
