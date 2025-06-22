import { User } from "@prisma/__generated__"
import { Request } from "express"

export type AuthorizedRequest = Request & { user: User }
