import type { Logger } from "pino"
import type { Response, Request, CookieOptions } from "express"
import type { AuthController } from "./auth.controller.js"
import type { AuthService } from "../service/auth.service.js"
import type { AccessTokenResponse, JwtTokens, LoginRequest, SignupRequest } from "../schema/auth.schema.js"

export class AuthControllerV1 implements AuthController {
    private readonly REFRESH_TOKEN_COOKIE_HEADER = 'refreshToken'
    constructor(
        private readonly authService: AuthService,
        private readonly cookieOptions: CookieOptions,
        private readonly log: Logger,
    ) { }

    async signup(
        req: Request<any, any, SignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        this.log.info({ userName: req.body.userName }, "Request signup arrived")
        const jwtTokens: JwtTokens = await this.authService.signup({
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
        req: Request<any, any, LoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        this.log.info({ userName: req.body.userName }, "Request Login arrived")
        const jwtTokens: JwtTokens = await this.authService.login({
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
        const jwtTokens: JwtTokens = await this.authService.refreshToken(req.cookies[this.REFRESH_TOKEN_COOKIE_HEADER])
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