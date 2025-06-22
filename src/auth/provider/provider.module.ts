import { DynamicModule, Module } from "@nestjs/common"

import {
	AsyncOptionsType,
	OptionsType,
	ProviderOptionsSymbol
} from "./provider.constants"
import { ProviderService } from "./provider.service"

/**
 * Модуль для управления OAuth провайдерами
 * Поддерживает как синхронную, так и асинхронную регистрацию сервисов
 */
@Module({})
export class ProviderModule {
	/**
	 * Регистрирует модуль с синхронной конфигурацией
	 * @param options - Конфигурация провайдера с базовым URL и массивом сервисов
	 * @returns Динамический модуль с настроенными провайдерами
	 */
	public static register(options: OptionsType): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}

	/**
	 * Регистрирует модуль с асинхронной конфигурацией
	 * Позволяет динамически создавать конфигурацию через фабрику
	 * @param options - Асинхронная конфигурация с импортами, фабрикой и инъекциями
	 * @returns Динамический модуль с настроенными провайдерами
	 */
	public static registerAsync(options: AsyncOptionsType): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsSymbol,
					inject: options.inject
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}
}
