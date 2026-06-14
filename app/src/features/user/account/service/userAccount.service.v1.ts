import type { UserAccountService } from "./userAccount.service.js"
import type { UserRepository, UserUpdateDBInput } from "../../shared/repository/user.repository.js"
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import { type User, UserRoles, UserStatus } from "../../../../shared/infra/db/generated.prisma/client.js"
import { logger } from "../../../../shared/logger/logger.js"
import { InvalidInput } from "../../../../shared/exception/httpException.js"
import { MappingError } from "../../../../shared/exception/serverException.js"

export class UserAccountServiceV1 implements UserAccountService {
    constructor(
        readonly repository: UserRepository
    ) { }

    public async getMyAccount(
        userId: string
    ): Promise<UserAccountResponse> {
        logger.info("Fetching User from DB")
        const dbUser: User = await this.verifyNonDeletedUser(userId)
        logger.info(`Fetched User from DB`)
        return this.toUserAccountResponse(dbUser)
    }

    public async updateMyAccount(
        userId: string,
        dto: UserAccountRequest
    ): Promise<UserAccountResponse> {
        logger.info("Updating User from DB")
        await this.verifyNonDeletedUser(userId)
        const updatedUser: User = await this.repository.updateUserById(userId, dto)
        logger.info("Updated User from DB")
        return this.toUserAccountResponse(updatedUser)
    }

    public async deleteMyAccount(
        userId: string
    ): Promise<void> {
        logger.info("Deleting User from DB")
        await this.verifyNonDeletedUser(userId)
        const deletedUserState: UserUpdateDBInput = {
            name: null,
            displayName: 'deleted',
            emailAddress: null,
            passwordHash: null,
            status: UserStatus.deleted,
            roles: [UserRoles.deleted]
        }
        await this.repository.updateUserById(userId, deletedUserState)
        logger.info("User deleted from DB")
    }

    private async verifyNonDeletedUser(
        userId: string
    ): Promise<User> {
        const dbUser: User | null = await this.repository.getUserById(userId)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInput('User has already been deleted')
        return dbUser
    }

    private toUserAccountResponse(
        user: User
    ): UserAccountResponse {
        if (!user.name || !user.display_name || !user.email_address || !user.email_address || !user.status) {
            throw new MappingError('Mapping to Response failed - required field is missing')
        }
        return {
            id: user.id,
            name: user.name,
            displayName: user.display_name,
            emailAddress: user.email_address,
            status: user.status,
        }
    }
}