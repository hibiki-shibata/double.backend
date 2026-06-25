import z from "zod"
import { userShape } from "../../shared/schema/user.schema.shape.js"

export const userAccountSchema = {
    editRequest: z.object({
        name: userShape.name,
        displayName: userShape.displayName,
        emailAddress: userShape.emailAddress,
        password: userShape.password.optional(),
    }),

    response: z.object({
        id: userShape.id,
        name: userShape.name,
        displayName: userShape.displayName,
        emailAddress: userShape.emailAddress,
        status: userShape.status
    })

}

export type UserAccountEditRequest = z.infer<typeof userAccountSchema.editRequest>
export type UserAccountResponse = z.infer<typeof userAccountSchema.response>