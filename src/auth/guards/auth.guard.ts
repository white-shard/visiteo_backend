import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"

import { UserService } from "@/user/user.service"

import { AuthorizedRequest } from "../types/auth.types"

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<AuthorizedRequest>()

		if (typeof request.session.userId == "undefined") {
			throw new UnauthorizedException(
				"Пользователь не авторизован. Для получения доступа войдите в систему"
			)
		}

		const user = await this.userService.findById(request.session.userId)

		if (!user) {
			throw new UnauthorizedException(
				"Пользователь не найден. Возможно он был удален"
			)
		}

		request.user = user
		return true
	}
}
