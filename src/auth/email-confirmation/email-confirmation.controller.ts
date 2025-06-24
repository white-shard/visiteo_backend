import { Controller } from "@nestjs/common"
import { EmailConfirmationService } from "./email-confirmation.service"

@Controller("confirmation")
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService
	) {}
}
