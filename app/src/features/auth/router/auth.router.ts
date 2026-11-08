import { Router } from 'express'

import { authenticate } from '@global-shared/middleware/authenticate.js'
import { verifyRequestBody } from '@global-shared/middleware/verifyRequestBody.js'

import { authorize } from '@global-shared/middleware/authorize.js'
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js'
import type { AuthController } from '../controller/auth.controller.js'
import { LoginRequestSchema, SignupRequestSchema } from '../schema/auth.schema.js'

export function authRouter(
    controller: AuthController
): Router {
    const router: Router = Router()
    router.post(
        '/signup',
        verifyRequestBody(SignupRequestSchema),
        controller.signup
    )
    router.post(
        '/login',
        verifyRequestBody(LoginRequestSchema),
        controller.login
    )
    router.post(
        '/refreshToken',
        controller.refreshToken
    )
    router.post('/logout',
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        controller.logout
    )
    return router
}
