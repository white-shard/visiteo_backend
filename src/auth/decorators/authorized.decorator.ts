import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { User } from "@prisma/__generated__"

import { AuthorizedRequest } from "../types/auth.types"

/**
 * Декоратор для получения авторизованного пользователя из контекста запроса.
 *
 * Извлекает пользователя из объекта запроса.
 * Если указано поле пользователя, возвращает только это поле.
 *
 * @param data - Опциональное поле пользователя для извлечения.
 * @param context - Контекст выполнения запроса.
 * @returns Пользователь или указанное поле пользователя.
 */
export const AuthorizedUser = createParamDecorator(
	(data: keyof User, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<AuthorizedRequest>()
		const user = request.user

		return data ? user[data] : user
	}
)
