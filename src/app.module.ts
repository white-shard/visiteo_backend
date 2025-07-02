import { Module } from "@nestjs/common"

import { AuthModule } from "./auth/auth.module"
import { EmailConfirmationModule } from "./auth/email-confirmation/email-confirmation.module"
import { ProviderModule } from "./auth/provider/provider.module"
import { CacheModule } from "./libs/cache/cache.module"
import { MailModule } from "./libs/mail/mail.module"
import { PrismaModule } from "./prisma/prisma.module"
import { UserModule } from "./user/user.module"
import { PasswordRecoveryModule } from "./auth/password-recovery/password-recovery.module"

@Module({
	imports: [
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule,
		MailModule,
		EmailConfirmationModule,
		CacheModule,
		PasswordRecoveryModule
	]
})
export class AppModule {}
