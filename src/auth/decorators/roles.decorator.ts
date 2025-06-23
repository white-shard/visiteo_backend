import { SetMetadata } from "@nestjs/common"
import { UserRole } from "@prisma/__generated__"

export const ROLES_KEY = "user_roles"

/**
 * Декоратор для установки ролей пользователей.
 *
 * Устанавливает метаданные с ролями пользователей,
 * которые затем используются RolesGuard для проверки доступа.
 *
 * @param roles - Массив ролей пользователей.
 * @returns Декоратор с установленными метаданными ролей.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
