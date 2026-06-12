import type { JwtTokensDTO, RefreshTokenClaim } from "../../../../shared/auth/jwtToken.type.js"
import { UserStatus, type User } from "../../../../shared/infra/db/generated.prisma/client.js"
import { InvalidInput } from "../../../../shared/exception/httpException.js"
import { logger } from "../../../../shared/logger/logger.js"
import { userRepository } from "../../shared/user.repository.js"
import { toCreateUser } from "../../shared/toUserRepository.mapper.js"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import { toAccessTokenClaim, toRefreshTokenClaim } from "../mapper/toJwtTokenClaim.mapper.js"
import { passwordService } from "./password.service.js"
import { jwtTokenService } from "../../../../shared/auth/jwtToken.service.js"

class UserAuthService {

    public async signup(
        dto: UserSignupRequest
    ): Promise<JwtTokensDTO> {
        const dbUser: User = await userRepository.getUserByUserName(dto.userName)
        if (dbUser.name) throw new InvalidInput('Input username is already taken')

        const hashedPassword: string = await passwordService.hashPassword(dto.password)

        const createdUser: User = await userRepository.createUser(toCreateUser(hashedPassword, dto))

        logger.info({ userId: createdUser.id }, "User signup success")
        return this.getJwtTokensFor(createdUser)
    }

    public async login(
        dto: UserLoginRequest
    ): Promise<JwtTokensDTO> {
        logger.info({ userId: dto.userName }, "Attempting user login")

        const dbUser: User = await userRepository.getUserByUserName(dto.userName)
        if (!dbUser.password_hash || dbUser.status === UserStatus.deleted) {
            throw new InvalidInput('Password is not registered or User is already deleted')
        }

        await passwordService.verifyPassword(dto.password, dbUser.password_hash)

        logger.info({ userId: dbUser.id }, "User login success")
        return this.getJwtTokensFor(dbUser)
    }

    public async refreshToken(
        refreshToken: string
    ): Promise<JwtTokensDTO> {
        const refreshTokenClaim: RefreshTokenClaim = jwtTokenService.verifyRefreshToken(refreshToken)

        const dbUser: User = await userRepository.getUserById(refreshTokenClaim.userId)
        if (dbUser.status === UserStatus.deleted) throw new InvalidInput('User has already been deleted')

        return this.getJwtTokensFor(dbUser)
    }

    private getJwtTokensFor(
        user: User
    ): JwtTokensDTO {
        const accessToken = jwtTokenService.generateAccessToken(toAccessTokenClaim(user))
        const refreshToken = jwtTokenService.generateRefreshToken(toRefreshTokenClaim(user))
        return { accessToken, refreshToken }
    }
}

export const userAuthService = new UserAuthService 