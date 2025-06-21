import { Injectable } from "@nestjs/common"
import { AuthMethod } from "@prisma/__generated__"
import { hash } from "argon2"

import { PrismaService } from "@/prisma/prisma.service"

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	public async findById(userId: string, includeAccounts: boolean = false) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			include: {
				accountList: includeAccounts
			}
		})

		return user
	}
	public async findByEmail(
		userEmail: string,
		includeAccounts: boolean = false
	) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: userEmail
			},
			include: {
				accountList: includeAccounts
			}
		})

		return user
	}
	public async create(
		email: string,
		password: string,
		displayName: string,
		avatarUrl: string,
		method: AuthMethod,
		isVerified: boolean,
		includeAccounts: boolean = false
	) {
		const user = await this.prisma.user.create({
			data: {
				email,
				password: password ? await hash(password) : "",
				displayName,
				avatarUrl,
				method,
				isVerified
			},
			include: {
				accountList: includeAccounts
			}
		})

		return user
	}
}
