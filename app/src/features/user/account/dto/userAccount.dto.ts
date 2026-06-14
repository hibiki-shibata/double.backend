import z from "zod"
import { userSchema } from "../../shared/schema/user.schema.js"

export const userAccountRequestSchema = z.object({
    name: userSchema.name,
    displayName: userSchema.displayName,
    emailAddress: userSchema.emailAddress,
})

export const userAccountResponseSchema = z.object({
    id: userSchema.id,
    name: userSchema.name,
    displayName: userSchema.displayName,
    emailAddress: userSchema.emailAddress,
    status: userSchema.status
})

export type UserAccountRequest = z.infer<typeof userAccountRequestSchema>
export type UserAccountResponse = z.infer<typeof userAccountResponseSchema>