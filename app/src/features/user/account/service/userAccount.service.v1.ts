import type { Logger } from "pino"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js"
import type { UserAccountService } from "./userAccount.service.js"
import type { UserRepository } from "../../shared/repository/user.repository.js"
import type { UserAccountEditRequest, UserAccountResponse } from "../schema/userAccount.schema.js"
import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import { type User, UserStatus } from "@global-shared/infra/db/generated.prisma/client.js"
import { InvalidInputErr } from "@global-shared/error/httpErrors.js"
import { MappingErr } from "@global-shared/error/serverErros.js"

export class UserAccountServiceV1 implements UserAccountService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly loggerContext: LoggerContext
    ) { }

    public async getAccountInfo(
        userId: string
    ): Promise<UserAccountResponse> {
        const dbUser: User = await this.verifyNonDeletedUser(userId)
        return this.toUserAccountResponse(dbUser)
    }

    public async updateAccount(
        userId: string,
        dto: UserAccountEditRequest
    ): Promise<UserAccountResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Updating User from DB")

        await this.verifyNonDeletedUser(userId)
        const updatedUser: User = await this.userRepository.updateUserById(userId, {
            name: dto.name,
            displayName: dto.displayName,
            emailAddress: dto.emailAddress,
            ...(dto.password && { passwordHash: await this.passwordService.hashPassword(dto.password) })
        })

        logger.info("Success updated User from DB")
        return this.toUserAccountResponse(updatedUser)
    }

    public async deleteAccount(
        userId: string
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Deleting User from DB")

        await this.verifyNonDeletedUser(userId)
        await this.userRepository.softDeleteById(userId)

        logger.info("Success deleting User from DB")
    }

    private async verifyNonDeletedUser(
        userId: string
    ): Promise<User> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Fetching User from DB")

        const dbUser: User = await this.userRepository.getById(userId)

        logger.info("Success Fetching User from DB")
        if (dbUser.status === UserStatus.DELETED) throw new InvalidInputErr('User has already been deleted')
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