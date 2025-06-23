import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ClassConstructor, plainToInstance } from "class-transformer"
import { Observable, map } from "rxjs"

import { TRANSFORM_RESPONSE_DTO_KEY } from "./transform.decorator"

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const dto = this.reflector.get<ClassConstructor<unknown>>(
			TRANSFORM_RESPONSE_DTO_KEY,
			context.getHandler()
		)

		return next.handle().pipe(
			map((data) => {
				if (!dto || typeof dto !== "function") return data as unknown

				if (Array.isArray(data)) {
					return data.map((item) =>
						plainToInstance(dto, item, { excludeExtraneousValues: true })
					)
				}

				return plainToInstance(dto, data, { excludeExtraneousValues: true })
			})
		)
	}
}
