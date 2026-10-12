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
import { InvalidInputErr, UnauthenticatedErr } from "@global-shared/error/httpErrors.js"
import { DatabaseErr, MappingErr } from "@global-shared/error/serverErros.js"
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js"
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js"

export class UserAuthServiceV1 implements UserAuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtTokenService,
        private readonly loggerContext: LoggerContext,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
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
        const claim: RefreshTokenClaim = this.jwtService.verifyRefreshToken(dto.refreshToken)

        await this.verifyAndAddNewTokenToBlockList(claim)

        const dbUser: User = await this.userRepository.getById(claim.userId)
        return this.generateJwtTokens(dbUser)
    }
    // fix
    public async logout(
        dto: UserAuthServceParams.RefreshToken
    ): Promise<null> {
        const claim: RefreshTokenClaim = this.jwtService.verifyRefreshToken(dto.refreshToken)

        await this.verifyAndAddNewTokenToBlockList(claim)

        return null
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

    private async verifyAndAddNewTokenToBlockList(refreshTokenClaim: RefreshTokenClaim): Promise<null> {
        if (!refreshTokenClaim.jti) throw new UnauthenticatedErr('Invalid Refresh Token - jti not found in refresh token')
        const cacheKey: string = this.cacheKeys.refreshBlocklist.byJti(refreshTokenClaim.jti)

        // check if Token is already blocked
        const isInBlockedList = await this.cacheService.getByKey(cacheKey)
        if (isInBlockedList) throw new UnauthenticatedErr('The token has already been revoked')

        // cache revoking token in block list
        await this.cacheService.set<string>({
            key: cacheKey,
            value: 'revoked',
            ttlSec: this.cacheTtlsSec.refreshBlocklist
        })
        return null
    }
}