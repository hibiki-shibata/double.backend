import { type User, UserStatus, UserRoles } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { CreateDbUserDto } from "../dto/userAccount.dto.js"
import { userRepository } from "../repository/user.repository.js"
import type { JwtTokensDto, RefreshTokenClaim } from "../../../shared/auth/type/jwtToken.type.js"
import { jwtTokenService, passwordService } from "../../../shared/auth/index.js"
import { InvalidInput, Unauthenticated } from "../../../shared/exception/httpException.js"
import { toAccessTokenClaim, toRefreshTokenClaim } from "../mapper/toJwtTokenClaims.js"

class UserAuthService {
    public async signup(dto: UserSignupRequest): Promise<JwtTokensDto> {
        const dbUser: User = await userRepository.getUserByUserName(dto.userName)
        if (dbUser.name) throw new InvalidInput('Input username is already taken')
        const creatingDbUser: CreateDbUserDto = {
            userName: dto.userName,
            displayName: dto.userName,
            passwordHash: await passwordService.hashPassword(dto.password),
            status: UserStatus.active,
            roles: [UserRoles.user],
        }
        const createdUser: User = await userRepository.createUser(creatingDbUser)
        return this.getJwtTokensFrom(createdUser)
    }

    public async login(dto: UserLoginRequest): Promise<JwtTokensDto> {
        const dbUser: User = await userRepository.getUserByUserName(dto.userName)
        if (!dbUser.password_hash) throw new Unauthenticated('Password_hash is missing for this user')
        await passwordService.verifyPassword(dto.password, dbUser.password_hash)
        return this.getJwtTokensFrom(dbUser)
    }

    public async refreshToken(refreshToken: string): Promise<JwtTokensDto> {
        const refreshTokenClaim: RefreshTokenClaim = jwtTokenService.verifyRefreshToken(refreshToken)
        const dbUser: User = await userRepository.getUserById(refreshTokenClaim.userId)
        return this.getJwtTokensFrom(dbUser)
    }

    private getJwtTokensFrom(user: User): JwtTokensDto {
        const accessToken = jwtTokenService.generateAccessToken(toAccessTokenClaim(user))
        const refreshToken = jwtTokenService.generateRefreshToken(toRefreshTokenClaim(user))
        return { accessToken, refreshToken }
    }
}

export const userAuthService = new UserAuthService 