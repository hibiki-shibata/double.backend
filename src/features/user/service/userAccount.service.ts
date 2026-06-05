import { type User } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"
import { toUserAccountResponse } from "../mapper/toUserAccountResponse.js"
import { userRepository } from "../repository/user.repository.js"

class UserAccountService {

    public async getMyAccount(userId: string): Promise<UserAccountResponse> {
        const user: User = await userRepository.getUserById(userId)
        return toUserAccountResponse(user)
    }

    public async updateMyAccount(user: UserAccountRequest): Promise<UserAccountResponse> {
        const updatedUser: User = await userRepository.updateUser(user)
        return toUserAccountResponse(updatedUser)
    }

    public async deleteMyAccount(userId: string): Promise<void> {
        await userRepository.deleteUserById(userId)
    }
}

export const userAccountService = new UserAccountService