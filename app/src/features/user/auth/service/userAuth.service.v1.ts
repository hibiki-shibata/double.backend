import type { UserAuthService } from "./userAuth.service.js"
import type { UserRepository } from "../../shared/repository/user.repository.js"
import type { JwtTokens, UserLoginRequest, UserSignupRequest } from "../schema/userAuth.schema.js"
import type { PasswordService } from "../../../../shared/auth/service/password.service.js"
import type { JwtTokenService } from "../../../../shared/auth/service/jwtToken.service.js"
import type { RefreshTokenClaim } from "../../../../shared/auth/type/jwtToken.type.js"
import type { Logger } from "pino"
import { type User, UserRoles, UserStatus } from "../../../../shared/infra/db/generated.prisma/client.js"
import { InvalidInputErr } from "../../../../shared/error/httpErrors.js"
import { DatabaseErr, MappingErr } from "../../../../shared/error/serverErros.js"

export class UserAuthServiceV1 implements UserAuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtTokenService,
        private readonly log: Logger
    ) { }

    public async signup(
        dto: UserSignupRequest
    ): Promise<JwtTokens> {
        const dbUser: User = await this.userRepository.getByUserName(dto.userName)
        if (dto.userName === dbUser.name) throw new InvalidInputErr('Input username is already taken')

        const hashedPassword: string = await this.passwordService.hashPassword(dto.password)
        const createdUser: User = await this.userRepository.createUser({
            name: dto.userName,
            displayName: '[new]' + dto.userName,
            passwordHash: hashedPassword,
            status: UserStatus.active,
            roles: [UserRoles.user]
        })

        this.log.info({ userId: createdUser.id }, "Sucess User signup")
        return this.generateJwtTokens(createdUser)
    }

    public async login(
        dto: UserLoginRequest
    ): Promise<JwtTokens> {
        this.log.info({ userName: dto.userName }, "user login-ing")

        const dbUser: User = await this.userRepository.getByUserName(dto.userName)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInputErr('User has already been deleted')
        if (!dbUser.password_hash) throw new DatabaseErr('Missing password registeration in DB')

        await this.passwordService.verifyPassword(dto.password, dbUser.password_hash)

        this.log.info({ userId: dbUser.id }, "Success user login-ing")
        return this.generateJwtTokens(dbUser)
    }

    public async refreshToken(
        refreshToken: string
    ): Promise<JwtTokens> {
        const refreshTokenClaim: RefreshTokenClaim = this.jwtService.verifyRefreshToken(refreshToken)

        const dbUser: User = await this.userRepository.getById(refreshTokenClaim.userId)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInputErr('User has already been deleted')

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