import { Exclude, Expose, Transform } from "class-transformer"

export class UserResponseDto {
	@Expose()
	id: string

	@Expose()
	email: string | null

	@Expose()
	displayName: string

	@Expose()
	avatarUrl: string | null

	@Expose()
	role: string

	@Expose()
	method: string

	@Expose()
	isVerified: boolean

	@Expose()
	isTwoFactorEnabled: boolean

	@Expose()
	@Transform(({ value }: { value: Date }) => value.toISOString())
	createdAt: Date

	@Expose()
	@Transform(({ value }: { value: Date }) => value.toISOString())
	updatedAt: Date

	@Exclude()
	password: string

	@Exclude()
	accountList: any[]

	@Exclude()
	tokenList: any[]
}
