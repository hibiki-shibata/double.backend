import z from "zod"
import { user } from "./shared.js"

const UserAccountRequest = z.object({
    name: user.name,
    displayName: user.displayName,
    emailAddress: user.emailAddress,
})

const UserAccountResponse = z.object({
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    emailAddress: user.emailAddress,
    status: user.status
})

export type UserAccountRequest = z.infer<typeof UserAccountRequest>
export type UserAccountResponse = z.infer<typeof UserAccountResponse>