import { Router } from 'express'
import type { UserAuthController } from '../controller/userAuth.controller.js'
import { authenticate } from '@global-shared/middleware/authenticate.js'
import { verifyRequestBody } from '@global-shared/middleware/verifyRequestBody.js'
import { UserLoginRequestSchema, UserSignupRequestSchema } from '../schema/userAuth.schema.js'
import { authorize } from '@global-shared/middleware/authorize.js'
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js'

export function userAuthRouter(
    controller: UserAuthController
): Router {
    const router: Router = Router()
    router.post(
        '/signup',
        verifyRequestBody(UserSignupRequestSchema),
        controller.signup
    )
    router.post(
        '/login',
        verifyRequestBody(UserLoginRequestSchema),
        controller.login
    )
    router.post(
        '/refreshToken',
        controller.refreshToken
    )
    router.post('/logout',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        controller.logout
    )
    return router
}
