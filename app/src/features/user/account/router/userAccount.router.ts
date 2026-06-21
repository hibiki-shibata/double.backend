import { Router } from 'express'
import type { UserAccountController } from '../controller/userAccount.controller.js'
import { userAccountEditRequestSchema } from '../schema/userAccount.schema.js'
import { verifyRequestBody } from '@global-shared/middleware/verifyRequestBody.js'

export function userAccountRouter(
    controller: UserAccountController,
): Router {
    const router: Router = Router()
    router.get('/me', controller.getMyAccount)
    router.put('/me', verifyRequestBody(userAccountEditRequestSchema), controller.updateMyAccount)
    router.delete('/me', controller.deleteMyAccount)
    return router
}