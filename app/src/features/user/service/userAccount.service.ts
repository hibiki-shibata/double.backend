import { InvalidInput } from "../../../shared/exception/httpException.js"
import { UserRoles, UserStatus, type User } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserUpdateInput } from "../../../shared/infra/db/generated.prisma/models.js"
import { logger } from "../../../shared/logger/logger.js"
import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"
import { toDBUserUpdateInput } from "../mapper/toRepository.mapper.js"
import { toUserAccountResponse } from "../mapper/toController.mapper.js"
import { userRepository } from "../repository/user.repository.js"

class UserAccountService {

    public async getMyAccount(
        userId: string
    ): Promise<UserAccountResponse> {
        logger.info("Fetching User from DB")
        const dbUser: User = await this.verifyNonDeletedUser(userId)
        logger.info(`Fetched User from DB`)
        return toUserAccountResponse(dbUser)
    }

    public async updateMyAccount(
        userId: string,
        dto: UserAccountRequest
    ): Promise<UserAccountResponse> {
        logger.info("Updating User from DB")
        await this.verifyNonDeletedUser(userId)
        const updatedUser: User = await userRepository.updateUserById(userId, toDBUserUpdateInput(dto))
        logger.info("Updated User from DB")
        return toUserAccountResponse(updatedUser)
    }

    public async deleteMyAccount(
        userId: string
    ): Promise<void> {
        logger.info("Deleting User from DB")
        await this.verifyNonDeletedUser(userId)
        const deletedUserState: UserUpdateInput = {
            name: null,
            display_name: 'deleted',
            email_address: null,
            password_hash: null,
            status: UserStatus.deleted,
            roles: [UserRoles.deleted]
        }
        await userRepository.updateUserById(userId, deletedUserState)
        logger.info("User deleted from DB")
    }

    private async verifyNonDeletedUser(
        userId: string
    ): Promise<User> {
        const dbUser: User = await userRepository.getUserById(userId)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInput('User has already been deleted')
        return dbUser
    }
}

export const userAccountService = new UserAccountService