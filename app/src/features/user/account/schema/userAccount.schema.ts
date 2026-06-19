import z from "zod"
import { userShape } from "../../shared/schema/user.schema.shape.js"

export const userAccountRequestSchema = z.object({
    name: userShape.name,
    displayName: userShape.displayName,
    emailAddress: userShape.emailAddress,
    password: userShape.password.optional(),
})

export const userAccountResponseSchema = z.object({
    id: userShape.id,
    name: userShape.name,
    displayName: userShape.displayName,
    emailAddress: userShape.emailAddress,
    status: userShape.status
})

export type UserAccountRequest = z.infer<typeof userAccountRequestSchema>
export type UserAccountResponse = z.infer<typeof userAccountResponseSchema>