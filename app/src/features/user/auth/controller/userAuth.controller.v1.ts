import type { Logger } from "pino"
import type { UserAuthService } from "../service/userAuth.service.js"
import type { Response, Request, CookieOptions } from "express"
import type { JwtTokens, AccessTokenResponse, UserLoginRequest, UserSignupRequest } from "../schema/userAuth.schema.js"
import type { UserAuthController } from "./userAuth.controller.js"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js"

export class UserAuthControllerV1 implements UserAuthController {
    private readonly REFRESH_TOKEN_COOKIE_HEADER = 'refreshToken'
    constructor(
        private readonly userAuthService: UserAuthService,
        private readonly cookieOptions: CookieOptions,
        private readonly loggerContext: LoggerContext,
    ) { }

    async signup(
        req: Request<unknown, unknown, UserSignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ userName: req.body.userName }, "Request signup arrived")

        const jwtTokens: JwtTokens = await this.userAuthService.signup({
            userName: req.body.userName,
            password: req.body.password
        })

        logger.info({ userName: req.body.userName }, "Response success signup sent")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE_HEADER, jwtTokens.refreshToken, this.cookieOptions)
            .status(201)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async login(
        req: Request<unknown, unknown, UserLoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ userName: req.body.userName }, "Request Login arrived")

        const jwtTokens: JwtTokens = await this.userAuthService.login({
            userName: req.body.userName,
            password: req.body.password
        })

        logger.info({ userName: req.body.userName }, "Response success login sent")
        res
            .cookie(this.REFRESH_TOKEN_COOKIE_HEADER, jwtTokens.refreshToken, this.cookieOptions)
            .status(200)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async refreshToken(
        req: Request<unknown, unknown, void>,
        res: Response<AccessTokenResponse>
    ): Promise<void> {
        const jwtTokens: JwtTokens = await this.userAuthService.refreshToken(req.cookies[this.REFRESH_TOKEN_COOKIE_HEADER])
        res
            .cookie(this.REFRESH_TOKEN_COOKIE_HEADER, jwtTokens.refreshToken, this.cookieOptions)
            .status(200)
            .json(this.toAccessTokenResponse(jwtTokens))
    }

    async logout(
        _req: Request<unknown, unknown, void>,
        res: Response<void>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request Logout arrived")

        res.removeHeader(this.REFRESH_TOKEN_COOKIE_HEADER)

        logger.info("Response success Logout sent")
        res
            .clearCookie(this.REFRESH_TOKEN_COOKIE_HEADER, this.cookieOptions)
            .status(200)
            .end()
    }

    private toAccessTokenResponse(jwtTokens: JwtTokens): AccessTokenResponse {
        return { accessToken: jwtTokens.accessToken }
    }
}