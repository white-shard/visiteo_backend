import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ClassConstructor, plainToInstance } from "class-transformer"
import { Observable, map } from "rxjs"

import { TRANSFORM_RESPONSE_DTO_KEY } from "./decorator"

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const dto = this.reflector.get<ClassConstructor<any>>(
			TRANSFORM_RESPONSE_DTO_KEY,
			context.getHandler()
		)

		return next.handle().pipe(
			map((data) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				if (!dto || typeof dto !== "function") return data

				if (Array.isArray(data)) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return data.map((item) =>
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return
						plainToInstance(dto, item, { excludeExtraneousValues: true })
					)
				}

				// Если одиночный объект
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return plainToInstance(dto, data, { excludeExtraneousValues: true })
			})
		)
	}
}
