import type { Logger } from "pino"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js"
import type { UserAccountService, UserAccountServiceParams } from "./userAccount.service.js"
import type { UserRepository, UserRepositoryInput } from "../../shared/repository/user.repository.js"
import type { UserAccountResponse } from "../schema/userAccount.schema.js"
import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import type { User } from "@global-shared/infra/db/generated.prisma/client.js"
import { UserRoles, UserStatus } from "@global-shared/infra/db/generated.prisma/enums.js"
import { InvalidInputErr } from "@global-shared/error/httpErrors.js"
import { MappingErr } from "@global-shared/error/serverErros.js"

export class UserAccountServiceV1 implements UserAccountService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly loggerContext: LoggerContext
    ) { }

    public async getAccountDetail(
        dto: UserAccountServiceParams.GetAccountDetail
    ): Promise<UserAccountResponse> {
        const dbUser: User = await this.verifyNonDeletedUserById(dto.userId)
        return this.toUserAccountResponse(dbUser)
    }

    public async updateAccountDetail(
        dto: UserAccountServiceParams.UpdateAccountDetail
    ): Promise<UserAccountResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Updating User from DB")

        await this.verifyNonDeletedUserById(dto.userId)
        const updateInputData: UserRepositoryInput.UpdateById = {
            name: dto.name,
            displayName: dto.displayName,
            emailAddress: dto.emailAddress,
        }
        if (dto.password) updateInputData.passwordHash = await this.passwordService.hashPassword(dto.password)
        const updatedUser: User = await this.userRepository.updateById(dto.userId, updateInputData)

        logger.info("Success updated User from DB")
        return this.toUserAccountResponse(updatedUser)
    }

    public async deleteAccount(
        dto: UserAccountServiceParams.DeleteAccount
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Deleting User from DB")

        await this.verifyNonDeletedUserById(dto.userId)
        await this.userRepository.updateById(dto.userId, {
            name: null,
            displayName: 'deleted',
            emailAddress: null,
            passwordHash: null,
            status: UserStatus.DELETED,
            roles: [UserRoles.DELETED]
        })

        logger.info("Success deleting User from DB")
    }

    private async verifyNonDeletedUserById(
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