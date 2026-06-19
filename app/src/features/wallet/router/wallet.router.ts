import { Router } from 'express'
import type { WalletController } from '../controller/wallet.controller.js'
import { validateRequestBody } from '@global-shared/middleware/validateRequestBody.js'
import { depositRequestSchema, withdrawRequestSchema } from '../schema/wallet.schema.js'

export function walletRouter(
    controller: WalletController
): Router {
    const router: Router = Router()
    router.get('/me', controller.getMyWalletInfo)
    router.get('/history', controller.getMyWalletHistory)
    router.put('/deposit', validateRequestBody(depositRequestSchema), controller.deposit)
    router.put('/withdraw', validateRequestBody(withdrawRequestSchema), controller.withdraw)
    return router
    // router.post('/bank', controller.registerMyBankInfo)
}
