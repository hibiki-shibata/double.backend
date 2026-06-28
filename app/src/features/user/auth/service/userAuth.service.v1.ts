import type { Logger } from "pino"
import type { UserAuthServceParams, UserAuthService } from "./userAuth.service.js"
import type { UserRepository } from "../../shared/repository/user.repository.js"
import type { JwtTokens } from "../schema/userAuth.schema.js"
import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import type { JwtTokenService } from "@global-shared/auth/service/jwtToken.service.js"
import type { RefreshTokenClaim } from "@global-shared/auth/type/jwtToken.type.js"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js"
import type { User } from "@global-shared/infra/db/generated.prisma/client.js"
import { UserRoles, UserStatus } from "@global-shared/infra/db/generated.prisma/enums.js"
import { InvalidInputErr } from "@global-shared/error/httpErrors.js"
import { DatabaseErr, MappingErr } from "@global-shared/error/serverErros.js"

export class UserAuthServiceV1 implements UserAuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtTokenService,
        private readonly loggerContext: LoggerContext
    ) { }

    public async signup(
        dto: UserAuthServceParams.Signup
    ): Promise<JwtTokens> {
        const logger: Logger = this.loggerContext.getLogger()

        const dbUser: User = await this.userRepository.getByUserName(dto.userName)
        if (dto.userName === dbUser.name) throw new InvalidInputErr('Input username is already taken')

        const hashedPassword: string = await this.passwordService.hashPassword(dto.password)
        const createdUser: User = await this.userRepository.create({
            name: dto.userName,
            displayName: '[new]' + dto.userName,
            passwordHash: hashedPassword,
            status: UserStatus.ACTIVE,
            roles: [UserRoles.USER]
        })

        logger.info({ userId: createdUser.id }, "Sucess User signup")
        return this.generateJwtTokens(createdUser)
    }

    public async login(
        dto: UserAuthServceParams.Login
    ): Promise<JwtTokens> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ userName: dto.userName }, "user login-ing")

        const dbUser: User = await this.verifyNonDeletedUserByUserName(dto.userName)
        if (!dbUser.password_hash) throw new DatabaseErr('Missing password registeration in DB')

        await this.passwordService.verifyPassword(dto.password, dbUser.password_hash)

        logger.info({ userId: dbUser.id }, "Success user login-ing")
        return this.generateJwtTokens(dbUser)
    }

    public async refreshToken(
        dto: UserAuthServceParams.RefreshToken
    ): Promise<JwtTokens> {
        const refreshTokenClaim: RefreshTokenClaim = this.jwtService.verifyRefreshToken(dto.refreshToken)

        const dbUser: User = await this.verifyNonDeletedUserByUserName(refreshTokenClaim.userId)

        return this.generateJwtTokens(dbUser)
    }

    private generateJwtTokens(
        user: User
    ): JwtTokens {
        if (!user.id || !user.name || !user.roles) throw new MappingErr('Insufficient user data for jwtTokenClaim')
        const accessToken = this.jwtService.generateAccessToken({
            userId: user.id,
            userName: user.name,
            roles: user.roles
        })
        const refreshToken = this.jwtService.generateRefreshToken({
            userId: user.id
        })
        return { accessToken, refreshToken }
    }

    private async verifyNonDeletedUserByUserName(userName: string): Promise<User> {
        const dbUser: User = await this.userRepository.getByUserName(userName)
        if (dbUser.status === UserStatus.DELETED) throw new InvalidInputErr('User has already been deleted')
        return dbUser
    }
}