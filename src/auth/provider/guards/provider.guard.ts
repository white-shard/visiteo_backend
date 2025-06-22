import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { Request } from "express"

import { ProviderService } from "../provider.service"

@Injectable()
export class AuthProviderGuard implements CanActivate {
	public constructor(private readonly providerService: ProviderService) {}

	public canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>()
		const provider = request.params.provider
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException(
				`Провайдер ${provider} не найден. Проверьте правильность введенных данных.`
			)
		}

		return true
	}
}
