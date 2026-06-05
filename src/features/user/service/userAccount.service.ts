import {
    //  type User,
    UserStatus
} from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"
// import { userRepository } from "../repository/user.repository.js"

export const UserAccountSerivce = {

    async getMyAccount(
        user: UserAccountRequest
    ): Promise<UserAccountResponse> {
        const updatedUser: UserAccountResponse = {
            id: user.id,
            name: 'string',
            display_name: 'string',
            email_address: 'string',
            status: UserStatus.active,
        }
        return updatedUser
    },

    async updateMyAccount(
        user: UserAccountRequest
    ): Promise<UserAccountResponse> {
        const updatedUser: UserAccountResponse = {
            id: user.id,
            name: 'string',
            display_name: 'string',
            email_address: 'string',
            status: UserStatus.active,
        }
        return updatedUser
    },

    async deleteMyAccount(
        user: UserAccountRequest
    ): Promise<void> {
        console.log(user)
        return
    },
}