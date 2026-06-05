import { type User, UserStatus } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"
import { toUserAccountResponse } from "../mapper/toUserAccountResponse.js"
import { UserRepository } from "../repository/user.repository.js"

export const UserAccountSerivce = {

    async getMyAccount(
        userId: string
    ): Promise<UserAccountResponse> {
        const user: User = await UserRepository.getUserById(userId)
        return toUserAccountResponse(user)
    },

    async updateMyAccount(
        user: UserAccountRequest
    ): Promise<UserAccountResponse> {
        const updatedUser: User = await UserRepository.updateUser(user)
        return toUserAccountResponse(updatedUser)
    },

    async deleteMyAccount(
        userId: string
    ): Promise<void> {
        await UserRepository.deleteUserById(userId)
    },
}