import z from "zod"
import { UserStatus } from "../../../shared/infra/db/generated.prisma/enums.js"
import { displayNameField, emailAddressField, userNameField } from "../config/dto.config.js"

const UserAccountRequest = z.object({
    name: userNameField,
    displayName: displayNameField,
    emailAddress: emailAddressField,
})
export type UserAccountRequest = z.infer<typeof UserAccountRequest>

const UserAccountResponse = z.object({
    id: z.uuidv4(),
    name: z.string('userName length must be min=4 max=10').min(4).max(10),
    displayName: z.string('userName length must be min=4 max=10').min(1).max(20),
    emailAddress: z.email(),
    status: UserStatus
})
export type UserAccountResponse = z.infer<typeof UserAccountResponse>