import z from "zod"
import { UserStatus, UserRoles } from "../../../shared/infra/db/generated.prisma/enums.js"

export const userSchema = {
    id: z.uuidv4(),
    name: z.string('userName length must be min=4 max=10').min(4).max(10),
    displayName: z.string('displayName length must be min=1 max=10').min(1).max(20),
    emailAddress: z.email('emailAddress validation failed'),
    password: z.string('password length must be min=8 max=25').min(8).max(25),
    status: z.enum(UserStatus),
    roles: z.array(z.enum(UserRoles))
}