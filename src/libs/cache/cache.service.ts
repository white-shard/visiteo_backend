import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import IORedis from "ioredis"
import { config } from "../config/app.config"

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
	public redis: IORedis

	onModuleInit() {
		this.redis = new IORedis(config.REDIS_URI)
	}

	async onModuleDestroy() {
		await this.redis.quit()
	}
}
