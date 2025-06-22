import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"

import { UserService } from "@/user/user.service"

import { AuthorizedRequest } from "../types/auth.types"

/**
 * Guard  для проверки аутентификации пользователя
 *
 * Проверяет наличие пользователя в сессии и валидность его данных.
 * Если пользователь не авторизован или не найден в базе данных,
 * выбрасывает UnauthorizedException.
 */
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	/**
	 * Проверяет возможность получения доступа к маршруту
	 *
	 * @param context - Контекст выполнения запроса
	 * @returns Promise<boolean> - true если пользователь авторизован и найден
	 * @throws UnauthorizedException - если пользователь не авторизован или не найден
	 */
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
