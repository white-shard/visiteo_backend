import { Module } from "@nestjs/common"

import { AuthModule } from "./auth/auth.module"
import { ProviderModule } from "./auth/provider/provider.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"

@Module({
	imports: [PrismaModule, AuthModule, UserModule, ProviderModule]
})
export class AppModule {}
