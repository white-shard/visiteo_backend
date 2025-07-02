import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post
} from "@nestjs/common"
import { PasswordRecoveryService } from "./password-recovery.service"
import { Recaptcha } from "@nestlab/google-recaptcha"
import { PasswordRecoveryDto } from "./dto/recovery.dto"
import { UserService } from "@/user/user.service"
import { NewPasswordDto } from "./dto/new-password.dto"
import { TransformResponse } from "@/libs/common/transform/transform.decorator"
import { AuthResponseDto } from "../dto/response/auth-response.dto"

/**
 * Контроллер для восстановления пароля пользователей
 *
 * Предоставляет API endpoints для:
 * - Запроса сброса пароля по email
 * - Установки нового пароля с использованием токена
 *
 * @example
 * // Запрос сброса пароля
 * POST /auth/password-recovery
 * {
 *   "email": "user@example.com"
 * }
 *
 * // Установка нового пароля
 * POST /auth/password-recovery/new-password
 * {
 *   "token": "jwt_token_here",
 *   "password": "newPassword123"
 * }
 */
@Controller("auth/password-recovery")
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService,
		private readonly userService: UserService
	) {}

	/**
	 * Запрос сброса пароля
	 *
	 * Отправляет email с ссылкой для сброса пароля на указанный адрес.
	 * Ссылка содержит JWT токен с ограниченным временем действия (1 час).
	 *
	 * @param body - Данные для запроса сброса пароля
	 * @param body.email - Email пользователя (максимум 64 символа)
	 *
	 * @returns Promise<void> - Успешная отправка email
	 *
	 * @throws {NotFoundException} - Если пользователь с указанным email не найден
	 * @throws {ValidationError} - Если email не прошел валидацию
	 *
	 * @example
	 * // Запрос
	 * POST /auth/password-recovery
	 * Content-Type: application/json
	 *
	 * {
	 *   "email": "user@example.com"
	 * }
	 *
	 * // Успешный ответ (200 OK)
	 * // Email отправлен на указанный адрес
	 *
	 * // Ошибка (404 Not Found)
	 * {
	 *   "message": "Пользователь с таким email не найден. Проверьте введенный email и попробуйте снова"
	 * }
	 */
	@Recaptcha()
	@Post()
	@HttpCode(HttpStatus.OK)
	public async reset(@Body() body: PasswordRecoveryDto) {
		const user = await this.userService.findByEmail(body.email)

		if (!user)
			throw new NotFoundException(
				"Пользователь с таким email не найден. Проверьте введенный email и попробуйте снова"
			)

		return this.passwordRecoveryService.sendToken(user.id, body.email)
	}

	/**
	 * Установка нового пароля
	 *
	 * Позволяет пользователю установить новый пароль с использованием токена,
	 * полученного по email. Токен должен быть действительным и не истекшим.
	 *
	 * @param body - Данные для установки нового пароля
	 * @param body.token - JWT токен для сброса пароля (получен по email)
	 * @param body.password - Новый пароль (от 8 до 48 символов)
	 *
	 * @returns Promise<AuthResponseDto> - Информация о пользователе и сообщение об успехе
	 *
	 * @throws {NotFoundException} - Если токен недействителен, истек или пользователь не найден
	 * @throws {ValidationError} - Если пароль не прошел валидацию
	 *
	 * @example
	 * // Запрос
	 * POST /auth/password-recovery/new-password
	 * Content-Type: application/json
	 *
	 * {
	 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	 *   "password": "newSecurePassword123"
	 * }
	 *
	 * // Успешный ответ (200 OK)
	 * {
	 *   "user": {
	 *     "id": "user-id",
	 *     "email": "user@example.com",
	 *     "name": "User Name",
	 *     // ... другие поля пользователя
	 *   },
	 *   "message": "Пароль успешно изменен"
	 * }
	 *
	 * // Ошибка (404 Not Found)
	 * {
	 *   "message": "Ссылка недействительна. Запросите новую ссылку для сброса пароля"
	 * }
	 */
	@Recaptcha()
	@Post("new-password")
	@HttpCode(HttpStatus.OK)
	@TransformResponse(AuthResponseDto)
	public async newPassword(@Body() body: NewPasswordDto) {
		return this.passwordRecoveryService.changePassword(
			body.token,
			body.password
		)
	}
}
