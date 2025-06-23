import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { Request } from "express"

import { ProviderService } from "../provider.service"

/**
 * Guard для проверки существования провайдера аутентификации
 *
 * Проверяет, что указанный провайдер аутентификации существует
 * в системе перед выполнением защищенного маршрута.
 */
@Injectable()
export class AuthProviderGuard implements CanActivate {
	public constructor(private readonly providerService: ProviderService) {}

	/**
	 * Проверяет возможность доступа к ресурсу
	 *
	 * Извлекает название провайдера из параметров запроса и проверяет
	 * его существование в системе через ProviderService.
	 *
	 * @param context - Контекст выполнения запроса
	 * @returns true если провайдер найден, иначе выбрасывает NotFoundException
	 * @throws NotFoundException - Если провайдер не найден
	 */
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
