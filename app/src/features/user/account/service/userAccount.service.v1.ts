import type { UserAccountService } from "./userAccount.service.js"
import type { UserRepository } from "../../shared/repository/user.repository.js"
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import type { Logger } from "pino"
import { logger } from "../../../../shared/logger/logger.js"
import { UserStatus, type User } from "../../../../shared/infra/db/generated.prisma/client.js"
import { InvalidInputErr } from "../../../../shared/error/httpErrors.js"
import { MappingErr } from "../../../../shared/error/serverErros.js"

export class UserAccountServiceV1 implements UserAccountService {
    private readonly log: Logger = logger
    constructor(
        private readonly repository: UserRepository
    ) { }

    public async getMyAccount(
        userId: string
    ): Promise<UserAccountResponse> {
        this.log.info({ userId }, "Fetching User from DB")
        const dbUser: User = await this.verifyNonDeletedUser(userId)
        this.log.info({ userId }, "Fetched User from DB")
        return this.toUserAccountResponse(dbUser)
    }

    public async updateMyAccount(
        userId: string,
        dto: UserAccountRequest
    ): Promise<UserAccountResponse> {
        this.log.info({ userId }, "Updating User from DB")
        await this.verifyNonDeletedUser(userId)
        const updatedUser: User = await this.repository.updateUserById(userId, dto)
        this.log.info({ userId }, "Updated User from DB")
        return this.toUserAccountResponse(updatedUser)
    }

    public async deleteMyAccount(
        userId: string
    ): Promise<void> {
        this.log.info({ userId }, "Deleting User from DB")
        await this.verifyNonDeletedUser(userId)
        await this.repository.softDeleteUserById(userId)
        this.log.info({ userId }, "User deleted from DB")
    }

    private async verifyNonDeletedUser(
        userId: string
    ): Promise<User> {
        const dbUser: User = await this.repository.getUserById(userId)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInputErr('User has already been deleted')
        return dbUser
    }

    private toUserAccountResponse(
        user: User
    ): UserAccountResponse {
        if (!user.name || !user.display_name || !user.email_address || !user.email_address || !user.status) {
            throw new MappingErr('Mapping to Response failed - required field is missing')
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