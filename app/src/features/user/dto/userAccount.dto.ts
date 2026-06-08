import { UserStatus, UserRoles } from "../../../shared/infra/db/generated.prisma/enums.js"

export type UserAccountRequest = {
    name: string,
    display_name: string,
    email_address: string
}

export type UpdateUserAccountDTO = {
    userId: string
    userName: string,
    displayName: string,
    emailAddress: string
}

export type UserAccountResponse = {
    id: string,
    name: string,
    display_name: string,
    email_address: string,
    status: UserStatus
}

export type CreateDbUserDTO = {
    userName: string,
    displayName: string,
    passwordHash: string,
    status: UserStatus,
    roles: UserRoles[]
}