import { Router } from 'express'
import type { UserAccountController } from '../controller/userAccount.controller.js'
import { userAccountRequestSchema } from '../schema/userAccount.schema.js'
import { validateRequestBody } from '../../../../shared/middleware/validateRequestBody.js'

export function userAccountRouter(
    controller: UserAccountController,
): Router {
    const router: Router = Router()
    router.get('/me', controller.getMyAccount)
    router.put('/me', validateRequestBody(userAccountRequestSchema), controller.updateMyAccount)
    router.delete('/me', controller.deleteMyAccount)
    return router
}