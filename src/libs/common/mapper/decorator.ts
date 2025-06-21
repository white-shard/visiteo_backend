import { SetMetadata } from "@nestjs/common"

export const TRANSFORM_RESPONSE_DTO_KEY = "transform_response_dto"

export function TransformResponse(dto: any) {
	return SetMetadata(TRANSFORM_RESPONSE_DTO_KEY, dto)
}
