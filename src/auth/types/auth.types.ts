import { User } from "@prisma/__generated__"
import { Request } from "express"

/**
 * Расширенный тип запроса с авторизованным пользователем
 *
 * @description Объединяет стандартный Express Request с объектом пользователя,
 * полученным после успешной аутентификации
 *
 * @example
 * ```typescript
 * app.get('/profile', authMiddleware, (req: AuthorizedRequest, res) => {
 *   const userId = req.user.id;
 *   const userEmail = req.user.email;
 * });
 * ```
 */
export type AuthorizedRequest = Request & { user: User }
