import { IsNotEmpty, IsString } from "class-validator"

/**
 * DTO для подтверждения email адреса
 */
export class ConfirmationDto {
	/**
	 * Токен подтверждения email (cuid)
	 * @example "cmckyunsd0000ggvl2x356oqw"
	 */
	@IsString()
	@IsNotEmpty()
	token: string
}
