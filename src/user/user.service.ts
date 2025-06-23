import { Injectable } from "@nestjs/common"
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
		email: string | null,
		password: string,
		displayName: string,
		avatarUrl: string,
		isEnabled: boolean,
		includeAccounts: boolean = false
	) {
		const user = await this.prisma.user.create({
			data: {
				email,
				password: password ? await hash(password) : "",
				displayName,
				avatarUrl,
				isEnabled
			},
			include: {
				accountList: includeAccounts
			}
		})

		return user
	}
}
