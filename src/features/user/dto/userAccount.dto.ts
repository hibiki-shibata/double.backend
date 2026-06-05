import { UserStatus } from "../../../shared/infra/db/generated.prisma/enums.js"

export type UserAccountRequest = {
    id: string,
    name: string,
    display_name: string,
    email_address: string
}

export type UserAccountResponse = {
    id: string,
    name: string,
    display_name: string,
    email_address: string,
    status: UserStatus
}