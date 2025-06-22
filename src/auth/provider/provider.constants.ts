import { FactoryProvider, ModuleMetadata } from "@nestjs/common"

import { BaseOAuthService } from "./services/base-oauth.service"

export const ProviderOptionsSymbol = Symbol()

export type OptionsType = {
	baseUrl: string
	services: BaseOAuthService<never>[]
}

export type AsyncOptionsType = Pick<ModuleMetadata, "imports"> &
	Pick<FactoryProvider<OptionsType>, "useFactory" | "inject">
