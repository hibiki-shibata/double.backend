import type { Logger } from "pino"
import type { UserAuthService } from "../service/userAuth.service.js"
import type { Response, Request, CookieOptions } from "express"
import type { JwtTokens, AccessTokenResponse, UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import type { UserAuthController } from "./userAuth.controller.js"

export class UserAuthControllerV1 implements UserAuthController {
    private readonly REFRESH_TOKEN_COOKIE_HEADER = 'refreshToken'
    constructor(
        private readonly userAuthService: UserAuthService,
        private readonly cookieOptions: CookieOptions,
        private readonly log: Logger,
    ) { }

    async signup(
        req: Request<{}, {}, UserSignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        this.log.info({ userName: req.body.userName }, "Request signup arrived")
        const jwtTokens: JwtTokens = await this.userAuthService.signup({
            userName: req.body.userName,
            password: req.body.password
        })
        this.log.info({ userName: req.body.userName }, "Response success signup sent")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE_HEADER, jwtTokens.refreshToken, this.cookieOptions)
            .status(201)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async login(
        req: Request<{}, {}, UserLoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        this.log.info({ userName: req.body.userName }, "Request Login arrived")
        const jwtTokens: JwtTokens = await this.userAuthService.login({
            userName: req.body.userName,
            password: req.body.password
        })
        this.log.info({ userName: req.body.userName }, "Response success login sent")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE_HEADER, jwtTokens.refreshToken, this.cookieOptions)
            .status(200)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async refreshToken(
        req: Request,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const jwtTokens: JwtTokens = await this.userAuthService.refreshToken(req.cookies[this.REFRESH_TOKEN_COOKIE_HEADER])
        res
            .cookie(this.REFRESH_TOKEN_COOKIE_HEADER, jwtTokens.refreshToken, this.cookieOptions)
            .status(200)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async logout(
        req: Request,
        res: Response
    ): Promise<void> {
        const userId = req.accessTokenClaim.userId
        this.log.info({ userId }, "Request Logout arrived")
        res.removeHeader(this.REFRESH_TOKEN_COOKIE_HEADER)
        this.log.info({ userId }, "Response success Logout sent")
        res
            .clearCookie(this.REFRESH_TOKEN_COOKIE_HEADER, this.cookieOptions)
            .status(200)
            .end()
    }

    private toAccessTokenResponse(jwtTokens: JwtTokens): AccessTokenResponse {
        return { accessToken: jwtTokens.accessToken }
    }
}