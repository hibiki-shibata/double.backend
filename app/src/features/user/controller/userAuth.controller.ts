import type { Response, Request } from "express"
import type { JwtTokensDto } from "../../../shared/auth/type/jwtToken.type.js"
import { Unauthenticated } from "../../../shared/exception/httpException.js"
import { cookieOptions } from "../../../shared/config/security.config.js"
import { toUserLoginRequest, toUserSignupRequest } from "../mapper/userAuth.mapper.js"
import { userAuthService } from "../service/userAuth.service.js"
import type { AccessTokenResponse } from "../dto/accessTokenResponse.dto.js"

const REFRESH_TOKEN_COOKIE = 'refreshToken'

export const UserAuthController = {

    async signup(
        req: Request,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const jwtToken: JwtTokensDto = await userAuthService.signup(toUserSignupRequest(req))
        res
            .cookie(REFRESH_TOKEN_COOKIE, jwtToken.refreshToken, cookieOptions)
            .status(201)
            .json({ accessToken: jwtToken.accessToken })
    },

    async login(
        req: Request,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const jwtToken: JwtTokensDto = await userAuthService.login(toUserLoginRequest(req))
        res
            .cookie(REFRESH_TOKEN_COOKIE, jwtToken.refreshToken, cookieOptions)
            .status(200)
            .json({ accessToken: jwtToken.accessToken })
    },

    async refreshToken(
        req: Request,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const refreshToken: string | undefined = req.header(REFRESH_TOKEN_COOKIE)
        if (!refreshToken) throw new Unauthenticated('Request header is missing refreshToken')
        const jwtToken: JwtTokensDto = await userAuthService.refreshToken(refreshToken)
        res
            .cookie(REFRESH_TOKEN_COOKIE, jwtToken.refreshToken, cookieOptions)
            .status(200)
            .json({ accessToken: jwtToken.accessToken })
    },

    async logout(
        _req: Request,
        res: Response
    ): Promise<void> {
        res.removeHeader(REFRESH_TOKEN_COOKIE)
        res
            .clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions)
            .status(200)
            .end()
    },
}