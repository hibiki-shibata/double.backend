import { type User, UserStatus, UserRoles } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { CreateUserDto, UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import { userRepository } from "../repository/user.repository.js"
import { toUserAccountResponse } from "../mapper/toUserAccountResponse.js"
import type { JwtTokenResponse } from "../../../shared/auth/jwtToken.type.js"
import { passwordService } from "../../../shared/auth/password.service.js"
import { InvalidInput } from "../../../shared/exception/httpException.js"

class UserAuthService {
    public async signup(req: UserSignupRequest): Promise<UserAccountResponse> {
        if (!req.password) throw new InvalidInput('Password is required to signup')
        const passwordHash: string = await passwordService.hashPassword(req.password)
        const newUser: CreateUserDto = {
            userName: req.userName,
            displayName: req.userName,
            passwordHash: passwordHash,
            status: UserStatus.active,
            roles: [UserRoles.user],
        }
        const createdUser: User = await userRepository.createUser(newUser)
        return toUserAccountResponse(createdUser)
    }

    public async login(req: UserLoginRequest): Promise<UserAccountResponse> {
        if (!req.password) throw new InvalidInput('Password is required to login')
        const existingUser: User = await userRepository.getUserByUserName(req.userName)
        if (!passwordService.isPasswordValid(req.password, existingUser.password_hash!)) {
            throw new InvalidInput('Invalid Password')
        }
        return toUserAccountResponse(existingUser)
    }

    public async logout(user: UserAccountRequest): Promise<void> {
        console.log(user)
    }

    public async refreshToken(refreshToken: string): Promise<JwtTokenResponse> {
        const jwtToken: JwtTokenResponse = {
            accessToken: 'aaaa',
            refreshToken: refreshToken
        }
        return jwtToken
    }
}

export const userAuthService = new UserAuthService 