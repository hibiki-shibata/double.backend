import type { UserAuthService } from "../service/userAuth.service.js"
import type { Response, Request } from "express"
import type { JwtTokens, AccessTokenResponse, UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { Logger } from "pino"
import { logger } from "../../../../shared/logger/logger.js"
import { cookieOptions } from "../../../../shared/config/security.config.js"

export class UserAuthController {
    private readonly REFRESH_TOKEN_COOKIE = 'refreshToken'
    private readonly log: Logger = logger
    constructor(
        private readonly service: UserAuthService
    ) { }

    async signup(
        req: Request<{}, {}, UserSignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        this.log.info({ userName: req.body.userName }, "Signup Request arrived")
        const jwtTokens: JwtTokens = await this.service.signup(req.body)
        this.log.info({ userName: req.body.userName }, "Signup Success Response dispatched")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE, jwtTokens.refreshToken, cookieOptions)
            .status(201)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async login(
        req: Request<{}, {}, UserLoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        this.log.info({ userName: req.body.userName }, "Login Request arrived")
        const jwtTokens: JwtTokens = await this.service.login(req.body)
        this.log.info({ userName: req.body.userName }, "Login Success Response dispatched")
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
        req: Request,
        res: Response
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Logout Request arrived")
        res.removeHeader(this.REFRESH_TOKEN_COOKIE)
        this.log.info({ userId }, "Logout response success dispatched")
        res
            .clearCookie(this.REFRESH_TOKEN_COOKIE, cookieOptions)
            .status(200)
            .end()
    }

    private toAccessTokenResponse(jwtTokens: JwtTokens): AccessTokenResponse {
        return { accessToken: jwtTokens.accessToken }
    }
}