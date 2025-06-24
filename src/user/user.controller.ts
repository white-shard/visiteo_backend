import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common"
import { User } from "@prisma/__generated__"

import { AuthorizedRequest } from "src/auth/decorators/auth.decorator"
import { AuthorizedUser } from "src/auth/decorators/authorized.decorator"
import { TransformResponse } from "src/libs/common/transform/transform.decorator"

import { UserResponseDto } from "./dto/response/user-response.dto"

@Controller("users")
export class UserController {
	@Get("current")
	@AuthorizedRequest()
	@HttpCode(HttpStatus.OK)
	@TransformResponse(UserResponseDto)
	getCurrentUser(@AuthorizedUser() user: User) {
		return user
	}
}
