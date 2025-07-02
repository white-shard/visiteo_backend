import { forwardRef, Module } from "@nestjs/common"
import { PasswordRecoveryService } from "./password-recovery.service"
import { PasswordRecoveryController } from "./password-recovery.controller"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "@/user/user.module"
import { config } from "@/libs/config/app.config"
import { AuthModule } from "../auth.module"
import { MailModule } from "@/libs/mail/mail.module"

@Module({
	imports: [
		MailModule,
		UserModule,
		forwardRef(() => AuthModule),
		JwtModule.register({ secret: config.VERIFICATION_SECRET })
	],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
