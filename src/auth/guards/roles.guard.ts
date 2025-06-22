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

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

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
