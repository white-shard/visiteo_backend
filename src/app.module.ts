import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as dotenv from "dotenv"
import * as dotenvExpand from "dotenv-expand"

import { AuthModule } from "./auth/auth.module"
import { validateConfig } from "./libs/common/validation/config.validator"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"

dotenvExpand.expand(dotenv.config())
const APPLICATION_ENV = process.env

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			isGlobal: true,
			load: [() => APPLICATION_ENV],
			validate: validateConfig
		}),
		PrismaModule,
		AuthModule,
		UserModule
	]
})
export class AppModule {}
