import type { Response, Request } from "express"
import type { UserAccountResponse } from "../dto/userAccount.dto.js"
import { UserAuthService } from "../service/userAuth.service.js"
import type { UserSignupRequest, UserLoginRequest } from "../dto/userAuth.dto.js"
import type { UserAccountRequest } from "../dto/userAccount.dto.js"

// Delete later
const exampleULoginUser: UserLoginRequest = {
    userName: 'string',
    password: 'string'
}
const exampleSignupUser: UserSignupRequest = {
    userName: 'string',
    password: 'string'
}

const exampleDto: UserAccountRequest = {
    id: 'string',
    name: 'string',
    display_name: 'string',
    email_address: 'string',
}

export const UserAuthController = {

    async login(
        _req: Request<UserLoginRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const user: UserAccountResponse
            = await UserAuthService.login(exampleULoginUser)
        res.status(200).json(user)
    },

    async signup(
        _req: Request<UserSignupRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const user: UserAccountResponse
            = await UserAuthService.signup(exampleSignupUser)
        res.status(201).json(user)
    },

    async logout(
        _req: Request,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        await UserAuthService.logout(exampleDto)
        res.status(200)
    },

    async refreshToken(
        _req: Request,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        await UserAuthService.refreshToken('refreshToken')
        res.status(201)
    },
}