import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { User } from "@prisma/__generated__"

import { AuthorizedRequest } from "../types/auth.types"

export const Authorized = createParamDecorator(
	(data: keyof User, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<AuthorizedRequest>()
		const user = request.user

		return data ? user[data] : user
	}
)
