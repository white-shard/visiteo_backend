import { IsNotEmpty, IsString } from "class-validator"

/**
 * DTO для подтверждения email адреса
 *
 * Используется для валидации входящих данных при подтверждении
 * email адреса пользователя через токен подтверждения.
 *
 * Токен должен быть получен из ссылки, отправленной на email
 * пользователя в процессе регистрации или смены email.
 */
export class EmailConfirmationDto {
	/**
	 * JWT токен подтверждения email
	 *
	 * Токен содержит зашифрованную информацию о пользователе и email
	 * для подтверждения. Генерируется сервисом EmailConfirmationService
	 * и отправляется пользователю в письме с ссылкой для подтверждения.
	 *
	 * Валидация:
	 * - Должен быть строкой
	 * - Не может быть пустым
	 * - Должен иметь корректный JWT формат
	 *
	 * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWNreXVuc2QwMDAwZ2d2bDJ4MzU2b3F3IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwidHlwZSI6IkVNQUlMIiwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjE3MzU2OTMyMDB9.signature"
	 */
	@IsString()
	@IsNotEmpty()
	token: string
}
