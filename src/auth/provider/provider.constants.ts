import { FactoryProvider, ModuleMetadata } from "@nestjs/common"

import { BaseOAuthService } from "./services/base-oauth.service"

/**
 * Символ для инъекции опций провайдера в DI контейнер
 */
export const ProviderOptionsSymbol = Symbol()

/**
 * Тип конфигурации провайдера OAuth сервисов
 */
export type OptionsType = {
	/** Базовый URL для всех OAuth сервисов */
	baseUrl: string
	/** Массив OAuth сервисов для регистрации */
	services: BaseOAuthService<never>[]
}

/**
 * Тип асинхронной конфигурации провайдера OAuth сервисов
 * Позволяет динамически создавать конфигурацию через фабрику
 */
export type AsyncOptionsType = Pick<ModuleMetadata, "imports"> &
	Pick<FactoryProvider<OptionsType>, "useFactory" | "inject">
