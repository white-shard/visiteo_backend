import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UserRole } from "@prisma/__generated__"

import { ROLES_KEY } from "../decorators/roles.decorator"
import { AuthorizedRequest } from "../types/auth.types"

/**
 * Guard для проверки аутентификации пользователя.
 *
 * Проверяет, имеет ли пользователь необходимые роли для доступа к ресурсу.
 * Роли определяются через декоратор @Roles() на уровне контроллера или метода.
 * Если пользователь не имеет требуемых ролей, выбрасывает ForbiddenException.
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	/**
	 * Проверяет возможность доступа к ресурсу на основе ролей
	 *
	 * @param context - Контекст выполнения запроса
	 * @returns boolean - true если пользователь имеет необходимые роли
	 * @throws ForbiddenException - если у пользователя недостаточно прав
	 */
	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if (!roles) return true

		const request = context.switchToHttp().getRequest<AuthorizedRequest>()

		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException(
				"Недостаточно прав для доступа к этому ресурсу"
			)
		}

		return true
	}
}
