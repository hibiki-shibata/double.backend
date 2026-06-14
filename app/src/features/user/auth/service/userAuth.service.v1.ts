import type { UserAuthService } from "./userAuth.service.js"
import type { UserRepository, UserCreateDBInput } from "../../shared/repository/user.repository.js"
import type { JwtTokens, UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { PasswordService } from "./password.service.js"
import type { JwtTokenService } from "../../../../shared/auth/service/jwtToken.service.js"
import { UserRoles, UserStatus, type User } from "../../../../shared/infra/db/generated.prisma/client.js"
import { logger } from "../../../../shared/logger/logger.js"
import { TokenType, type RefreshTokenClaim } from "../../../../shared/auth/type/jwtToken.type.js"
import { InvalidInput } from "../../../../shared/exception/httpException.js"
import { DatabaseError, MappingError } from "../../../../shared/exception/serverException.js"
import { v4 as uuidv4 } from 'uuid'

export class UserAuthServiceV1 implements UserAuthService {
    constructor(
        private readonly repository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtTokenService
    ) { }

    public async signup(
        dto: UserSignupRequest
    ): Promise<JwtTokens> {
        const dbUser: User = await this.repository.getUserByUserName(dto.userName)
        if (dto.userName === dbUser.name) throw new InvalidInput('Input username is already taken')

        const newUserInput: UserCreateDBInput = {
            name: dto.userName,
            displayName: '[new]' + dto.userName,
            passwordHash: await this.passwordService.hashPassword(dto.password),
            status: UserStatus.active,
            roles: [UserRoles.user]
        }
        const createdUser: User = await this.repository.createUser(newUserInput)

        logger.info({ userId: createdUser.id }, "User signup success")
        return this.generateJwtTokens(createdUser)
    }

    public async login(
        dto: UserLoginRequest
    ): Promise<JwtTokens> {
        logger.info({ userId: dto.userName }, "Attempting user login")

        const dbUser: User = await this.repository.getUserByUserName(dto.userName)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInput('User has already been deleted')
        if (!dbUser.password_hash) throw new DatabaseError('Missing password registeration in DB')

        await this.passwordService.verifyPassword(dto.password, dbUser.password_hash)

        logger.info({ userId: dbUser.id }, "User login success")
        return this.generateJwtTokens(dbUser)
    }

    public async refreshToken(
        refreshToken: string
    ): Promise<JwtTokens> {
        const refreshTokenClaim: RefreshTokenClaim = this.jwtService.verifyRefreshToken(refreshToken)

        const dbUser: User = await this.repository.getUserById(refreshTokenClaim.userId)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInput('User has already been deleted')

        return this.generateJwtTokens(dbUser)
    }

    private generateJwtTokens(
        user: User
    ): JwtTokens {
        if (!user.id || !user.name || !user.roles) throw new MappingError('Insufficient user data for jwtTokenClaim')
        const accessToken = this.jwtService.generateAccessToken({
            type: TokenType.accessToken,
            userId: user.id,
            userName: user.name,
            roles: user.roles,
            iat: Date.now()
        })
        const refreshToken = this.jwtService.generateRefreshToken({
            type: TokenType.refreshToken,
            tokenId: uuidv4(),
            userId: user.id,
        })
        return { accessToken, refreshToken }
    }
}