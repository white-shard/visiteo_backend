import { UseGuards, applyDecorators } from "@nestjs/common"
import { UserRole } from "@prisma/__generated__"

import { AuthGuard } from "../guards/auth.guard"
import { RolesGuard } from "../guards/roles.guard"

import { Roles } from "./roles.decorator"

/**
 * Декоратор для авторизации пользователей с определенными ролями.
 *
 * Применяет защиту на основе ролей и аутентификации.
 * Если указаны роли, применяется также декоратор Roles.
 *
 * @param roles - Массив ролей, которым разрешен доступ.
 * @returns Декораторы, применяемые к методу или классу.
 */
export function AuthorizedRequest(...roles: UserRole[]) {
	if (roles.length > 0) {
		return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard))
	}

	return applyDecorators(UseGuards(AuthGuard))
}
