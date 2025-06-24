import { Module } from "@nestjs/common"

import { AuthModule } from "./auth/auth.module"
import { ProviderModule } from "./auth/provider/provider.module"
import { MailModule } from "./libs/mail/mail.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"
import { EmailConfirmationModule } from "./auth/email-confirmation/email-confirmation.module"
import { CacheModule } from "./libs/cache/cache.module"

@Module({
	imports: [
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule,
		MailModule,
		EmailConfirmationModule,
		CacheModule
	]
})
export class AppModule {}
