import type { Response, Request } from "express"
import type { JwtTokensDTO } from "../../../shared/auth/type/jwtToken.type.js"
import { Unauthenticated } from "../../../shared/exception/httpException.js"
import { cookieOptions } from "../../../shared/config/security.config.js"
import { toUserLoginRequest, toUserSignupRequest } from "../mapper/userAuth.mapper.js"
import { userAuthService } from "../service/userAuth.service.js"
import type { AccessTokenResponse, RefreshTokenResponse, UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import { logger } from "../../../shared/logger/logger.js"

const REFRESH_TOKEN_COOKIE = 'refreshToken'

export const UserAuthController = {

    async signup(
        req: Request<{}, {}, UserSignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        logger.info({ userName: req.body.userName }, "Signup Request arrived")
        const jwtToken: JwtTokensDTO = await userAuthService.signup(toUserSignupRequest(req))
        logger.info({ userName: req.body.userName }, "Signup Success Response dispatched")
        res
            .cookie(REFRESH_TOKEN_COOKIE, jwtToken.refreshToken, cookieOptions)
            .status(201)
            .json({ accessToken: jwtToken.accessToken })
    },

    async login(
        req: Request<{}, {}, UserLoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        logger.info({ userName: req.body.userName }, "Login Request arrived")
        const jwtToken: JwtTokensDTO = await userAuthService.login(toUserLoginRequest(req))
        logger.info({ userName: req.body.userName }, "Login Success Response dispatched")
        res
            .cookie(REFRESH_TOKEN_COOKIE, jwtToken.refreshToken, cookieOptions)
            .status(200)
            .json({ accessToken: jwtToken.accessToken })
    },

    async refreshToken(
        req: Request<{}, {}, RefreshTokenResponse>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const refreshToken: string | undefined = req.cookies[REFRESH_TOKEN_COOKIE]
        if (!refreshToken) throw new Unauthenticated('Request header is missing refreshToken')
        const jwtToken: JwtTokensDTO = await userAuthService.refreshToken(refreshToken)
        res
            .cookie(REFRESH_TOKEN_COOKIE, jwtToken.refreshToken, cookieOptions)
            .status(200)
            .json({ accessToken: jwtToken.accessToken })
    },

    async logout(_req: Request, res: Response): Promise<void> {
        logger.info("Logout Request arrived")
        res.removeHeader(REFRESH_TOKEN_COOKIE)
        logger.info("Logout response success dispatched")
        res
            .clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions)
            .status(200)
            .end()
    },
}