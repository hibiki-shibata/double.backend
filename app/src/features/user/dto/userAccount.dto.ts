import { UserStatus } from "../../../shared/infra/db/generated.prisma/enums.js"

export type UserAccountRequest = {
    name: string,
    displayName: string,
    emailAddress: string
}

// export type UpdateUserAccountDTO = {
//     userId: string
//     userName: string,
//     displayName: string,
//     emailAddress: string
// }

export type UserAccountResponse = {
    id: string,
    name: string,
    displayName: string,
    emailAddress: string,
    status: UserStatus
}

// export type CreateDbUserDTO = {
//     userName: string,
//     displayName: string,
//     passwordHash: string,
//     status: UserStatus,
//     roles: UserRoles[]
// }