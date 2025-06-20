import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"

import { AppModule } from "./app.module"
import { config } from "./libs/config/app.config"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser(config.COOKIES_SECRET))
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.enableCors({
		origin: config.ALLOWED_ORIGIN,
		credentials: true,
		exposedHeaders: ["Set-Cookie"]
	})

	await app.listen(config.APPLICATION_PORT)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
