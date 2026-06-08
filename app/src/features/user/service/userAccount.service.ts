import { type User } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserAccountResponse, UpdateUserAccountDTO } from "../dto/userAccount.dto.js"
import { toUserAccountResponse } from "../mapper/userAccount.mapper.js"
import { userRepository } from "../repository/user.repository.js"

class UserAccountService {

    public async getMyAccount(user: UpdateUserAccountDTO): Promise<UserAccountResponse> {
        const dbUser: User = await userRepository.getUserById(user.userId)
        return toUserAccountResponse(dbUser)
    }

    public async updateMyAccount(user: UpdateUserAccountDTO): Promise<UserAccountResponse> {
        const updatedUser: User = await userRepository.updateUser(user)
        return toUserAccountResponse(updatedUser)
    }

    public async deleteMyAccount(user: UpdateUserAccountDTO): Promise<void> {
        await userRepository.deleteUserById(user.userId)
    }
}

export const userAccountService = new UserAccountService