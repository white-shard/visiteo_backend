import { Inject, Injectable, OnModuleInit } from "@nestjs/common"

import { OptionsType, ProviderOptionsSymbol } from "./provider.constants"

/**
 * Сервис для управления OAuth провайдерами
 * Инициализирует базовые URL для всех зарегистрированных сервисов
 * и предоставляет методы для поиска провайдеров по имени
 */
@Injectable()
export class ProviderService implements OnModuleInit {
	/**
	 * Создает экземпляр сервиса провайдера
	 * @param options - Конфигурация провайдера, инжектированная через DI
	 */
	public constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: OptionsType
	) {}

	/**
	 * Инициализирует модуль после создания всех провайдеров
	 * Устанавливает базовый URL для всех OAuth сервисов
	 */
	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	/**
	 * Находит OAuth провайдер по имени сервиса
	 * @param service - Имя сервиса для поиска
	 * @returns Найденный провайдер или null, если не найден
	 */
	public findByService(service: string) {
		return (
			this.options.services.find((provider) => provider.name === service) ??
			null
		)
	}
}
