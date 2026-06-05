import { type User, UserStatus, UserRoles } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { CreateUserDto, UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import { UserRepository } from "../repository/user.repository.js"
import { toUserAccountResponse } from "../mapper/toUserAccountResponse.js"
import type { JwtToken } from "../../../shared/auth/jwtToken.type.js"
import { PasswordService } from "../../../shared/auth/password.service.js"
import { InvalidInput } from "../../../shared/exception/invalidInput.js"

export const UserAuthService = {
    async signup(
        req: UserSignupRequest
    ): Promise<UserAccountResponse> {
        if (!req.password) throw new InvalidInput('Password is required to signup')
        const passwordHash: string = await PasswordService.hashPassword(req.password)
        const newUser: CreateUserDto = {
            userName: req.userName,
            displayName: req.userName,
            passwordHash: passwordHash,
            status: UserStatus.active,
            roles: [UserRoles.user],
        }
        const createdUser: User = await UserRepository.createUser(newUser)
        return toUserAccountResponse(createdUser)
    },

    async login(
        req: UserLoginRequest
    ): Promise<UserAccountResponse> {
        if (!req.password) throw new InvalidInput('Password is required to login')
        const existingUser: User = await UserRepository.getUserByUserName(req.userName)
        if (!PasswordService.isPasswordValid(req.password, existingUser.password_hash!)) {
            throw new Error
        }
        return toUserAccountResponse(existingUser)
    },

    async logout(
        user: UserAccountRequest
    ): Promise<void> {
        console.log(user)
    },

    async refreshToken(
        refreshToken: string
    ): Promise<JwtToken> {
        const jwtToken: JwtToken = {
            accessToken: 'aaaa',
            refreshToken: refreshToken
        }
        return jwtToken
    }
}