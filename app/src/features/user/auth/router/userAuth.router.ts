import { Router } from 'express'
import type { UserAuthController } from '../controller/userAuth.controller.js'
import { validateRequestBody } from '../../../../shared/middleware/validateRequestBody.js'
import { validateAuth } from '../../../../shared/middleware/validateAuth.js'
import { UserLoginRequestSchema, UserSignupRequestSchema } from '../dto/userAuth.dto.js'

export class UserAuthRouter {
    public readonly router: Router = Router()
    constructor(
        private readonly controller: UserAuthController
    ) { }
    create(): Router {
        this.router.post('/login', validateRequestBody(UserLoginRequestSchema), this.controller.login)
        this.router.post('/signup', validateRequestBody(UserSignupRequestSchema), this.controller.signup)
        this.router.post('/refreshToken', this.controller.refreshToken)
        this.router.post('/logout', validateAuth, this.controller.logout)
        return this.router
    }
}