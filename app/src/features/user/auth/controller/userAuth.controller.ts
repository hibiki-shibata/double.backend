import type { UserAuthService } from "../service/userAuth.service.js"
import type { Response, Request } from "express"
import type { JwtTokens, AccessTokenResponse, UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import { cookieOptions } from "../../../../shared/config/security.config.js"
import { logger } from "../../../../shared/logger/logger.js"

export class UserAuthController {
    private readonly REFRESH_TOKEN_COOKIE = 'refreshToken'
    constructor(
        private readonly service: UserAuthService
    ) { }

    async signup(
        req: Request<{}, {}, UserSignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        logger.info({ userName: req.body.userName }, "Signup Request arrived")
        const jwtTokens: JwtTokens = await this.service.signup(req.body)
        logger.info({ userName: req.body.userName }, "Signup Success Response dispatched")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE, jwtTokens.refreshToken, cookieOptions)
            .status(201)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async login(
        req: Request<{}, {}, UserLoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        logger.info({ userName: req.body.userName }, "Login Request arrived")
        const jwtTokens: JwtTokens = await this.service.login(req.body)
        logger.info({ userName: req.body.userName }, "Login Success Response dispatched")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE, jwtTokens.refreshToken, cookieOptions)
            .status(200)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async refreshToken(
        req: Request,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const jwtTokens: JwtTokens = await this.service.refreshToken(req.cookies[this.REFRESH_TOKEN_COOKIE])
        res
            .cookie(this.REFRESH_TOKEN_COOKIE, jwtTokens.refreshToken, cookieOptions)
            .status(200)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async logout(
        _req: Request,
        res: Response
    ): Promise<void> {
        logger.info("Logout Request arrived")
        res.removeHeader(this.REFRESH_TOKEN_COOKIE)
        logger.info("Logout response success dispatched")
        res
            .clearCookie(this.REFRESH_TOKEN_COOKIE, cookieOptions)
            .status(200)
            .end()
    }

    private toAccessTokenResponse(jwtTokens: JwtTokens): AccessTokenResponse {
        return { accessToken: jwtTokens.accessToken }
    }
}