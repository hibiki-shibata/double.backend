import type { Logger } from "pino"

import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import type { JwtTokenService } from "@global-shared/auth/service/jwtToken.service.js"
import type { RefreshTokenClaim } from "@global-shared/auth/type/jwtToken.type.js"
import { type User, UserRoles, UserStatus } from "@global-shared/infra/db/generated.prisma/client.js"
import { InvalidInputErr } from "@global-shared/error/httpErrors.js"
import { DatabaseErr, MappingErr } from "@global-shared/error/serverErros.js"
import type { AuthService } from "./auth.service.js"
import type { JwtTokens, SignupRequest } from "../schema/auth.schema.js"
import type { AuthRepository } from "../repository/auth.repository.js"

export class AuthServiceV1 implements AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtTokenService,
        private readonly log: Logger
    ) { }

    public async signup(
        dto: SignupRequest
    ): Promise<JwtTokens> {
        const dbUser: User = await this.authRepository.getByUserName(dto.userName)
        if (dto.userName === dbUser.name) throw new InvalidInputErr('Input username is already taken')

        const hashedPassword: string = await this.passwordService.hashPassword(dto.password)
        const createdUser: User = await this.authRepository.createUser({
            name: dto.userName,
            displayName: '[new]' + dto.userName,
            passwordHash: hashedPassword,
            status: UserStatus.ACTIVE,
            roles: [UserRoles.USER]
        })

        this.log.info({ userId: createdUser.id }, "Sucess User signup")
        return this.generateJwtTokens(createdUser)
    }

    public async login(
        dto: UserLoginRequest
    ): Promise<JwtTokens> {
        this.log.info({ userName: dto.userName }, "user login-ing")

        const dbUser: User = await this.authRepository.getByUserName(dto.userName)
        if (dbUser.status === UserStatus.DELETED) throw new InvalidInputErr('User has already been deleted')
        if (!dbUser.password_hash) throw new DatabaseErr('Missing password registeration in DB')

        await this.passwordService.verifyPassword(dto.password, dbUser.password_hash)

        this.log.info({ userId: dbUser.id }, "Success user login-ing")
        return this.generateJwtTokens(dbUser)
    }

    public async refreshToken(
        refreshToken: string
    ): Promise<JwtTokens> {
        const refreshTokenClaim: RefreshTokenClaim = this.jwtService.verifyRefreshToken(refreshToken)

        const dbUser: User = await this.authRepository.getById(refreshTokenClaim.userId)
        if (dbUser.status === UserStatus.DELETED) throw new InvalidInputErr('User has already been deleted')

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
}