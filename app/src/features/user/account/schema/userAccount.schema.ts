import z from "zod"
import { UserShape } from "../../shared/schema/user.schema.shape.js"

export const UserAccountSchema = {
    editRequest: z.object({
        name: UserShape.name,
        displayName: UserShape.displayName,
        emailAddress: UserShape.emailAddress,
        password: UserShape.password.optional(),
    }),

    response: z.object({
        id: UserShape.id,
        name: UserShape.name,
        displayName: UserShape.displayName,
        emailAddress: UserShape.emailAddress,
        status: UserShape.status
    })
}

export type UserAccountEditRequest = z.infer<typeof UserAccountSchema.editRequest>
export type UserAccountResponse = z.infer<typeof UserAccountSchema.response>