import z from "zod"
import { userSchema } from "./shared.schema.js"

export const UserAccountRequestSchema = z.object({
    name: userSchema.name,
    displayName: userSchema.displayName,
    emailAddress: userSchema.emailAddress,
})

export const UserAccountResponseSchema = z.object({
    id: userSchema.id,
    name: userSchema.name,
    displayName: userSchema.displayName,
    emailAddress: userSchema.emailAddress,
    status: userSchema.status
})

export type UserAccountRequest = z.infer<typeof UserAccountRequestSchema>
export type UserAccountResponse = z.infer<typeof UserAccountResponseSchema>