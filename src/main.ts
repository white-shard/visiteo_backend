import { ValidationPipe } from "@nestjs/common"
import { NestFactory, Reflector } from "@nestjs/core"
import { RedisStore } from "connect-redis"
import * as cookieParser from "cookie-parser"
import * as session from "express-session"
import IORedis from "ioredis"

import { AppModule } from "./app.module"
import { TransformResponseInterceptor } from "./libs/common/mapper/interceptor"
import { config } from "./libs/config/app.config"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const redis = new IORedis(config.REDIS_URI)

	app.use(cookieParser(config.COOKIES_SECRET))
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)
	app.useGlobalInterceptors(
		new TransformResponseInterceptor(app.get(Reflector))
	)

	app.use(
		session({
			secret: config.SESSION_SECRET,
			name: config.SESSION_NAME,
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.SESSION_DOMAIN,
				maxAge: config.SESSION_MAX_AGE,
				httpOnly: config.SESSION_HTTP_ONLY,
				secure: config.SESSION_SECURE,
				sameSite: "lax"
			},
			store: new RedisStore({
				client: redis,
				prefix: config.SESSION_FOLDER
			})
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
