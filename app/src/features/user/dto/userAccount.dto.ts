import z from "zod"
import { userSchema } from "./shared.schema.js"

const UserAccountRequest = z.object({
    name: userSchema.name,
    displayName: userSchema.displayName,
    emailAddress: userSchema.emailAddress,
})

const UserAccountResponse = z.object({
    id: userSchema.id,
    name: userSchema.name,
    displayName: userSchema.displayName,
    emailAddress: userSchema.emailAddress,
    status: userSchema.status
})

export type UserAccountRequest = z.infer<typeof UserAccountRequest>
export type UserAccountResponse = z.infer<typeof UserAccountResponse>