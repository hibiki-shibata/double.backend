import { type User } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"
import { toUserAccountResponse } from "../mapper/userAccount.mapper.js"
import { userRepository } from "../repository/user.repository.js"

class UserAccountService {

    public async getMyAccount(user: UserAccountRequest): Promise<UserAccountResponse> {
        const dbUser: User = await userRepository.getUserById(user.id)
        return toUserAccountResponse(dbUser)
    }

    public async updateMyAccount(user: UserAccountRequest): Promise<UserAccountResponse> {
        const updatedUser: User = await userRepository.updateUser(user)
        return toUserAccountResponse(updatedUser)
    }

    public async deleteMyAccount(user: UserAccountRequest): Promise<void> {
        await userRepository.deleteUserById(user.id)
    }
}

export const userAccountService = new UserAccountService