import { Router } from 'express'
import type { UserAuthController } from '../controller/userAuth.controller.js'
import { validateAuth } from '../../../../shared/middleware/validateAuth.js'
import { validateRequestBody } from '../../../../shared/middleware/validateRequestBody.js'
import { UserLoginRequestSchema, UserSignupRequestSchema } from '../schema/userAuth.schema.js'

export function userAuthRouter(
    controller: UserAuthController
): Router {
    const router: Router = Router()
    router.post('/signup', validateRequestBody(UserSignupRequestSchema), controller.signup)
    router.post('/login', validateRequestBody(UserLoginRequestSchema), controller.login)
    router.post('/refreshToken', controller.refreshToken)
    router.post('/logout', validateAuth, controller.logout)
    return router
}
