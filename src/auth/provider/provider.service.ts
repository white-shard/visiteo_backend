import { Inject, Injectable, OnModuleInit } from "@nestjs/common"

import { OptionsType, ProviderOptionsSymbol } from "./provider.constants"

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: OptionsType
	) {}

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByService(service: string) {
		return (
			this.options.services.find((provider) => provider.name === service) ??
			null
		)
	}
}
