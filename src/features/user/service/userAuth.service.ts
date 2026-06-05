import { UserStatus } from "../../../shared/infra/db/generated.prisma/client.js"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import type { JwtToken } from "../../../shared/auth/jwtToken.type.js"
// import { userRepository } from "../repository/user.repository.js"

export const UserAuthService = {
    async signup(
        req: UserSignupRequest
    ): Promise<UserAccountResponse> {
        const createdUser: UserAccountResponse = {
            id: 'stringify',
            name: req.userName,
            display_name: 'string',
            email_address: 'string',
            status: UserStatus.active,
        }
        return createdUser
    },

    async login(
        req: UserLoginRequest
    ): Promise<UserAccountResponse> {
        const createdUser: UserAccountResponse = {
            id: 'stringify',
            name: req.userName,
            display_name: 'string',
            email_address: 'string',
            status: UserStatus.active,
        }
        return createdUser
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