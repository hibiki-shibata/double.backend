import { Router } from 'express'
import type { WalletController } from '../controller/wallet.controller.js'
import { verifyRequestBody } from '@global-shared/middleware/verifyRequestBody.js'
import { verifyPaginationQuery } from '@global-shared/middleware/verifyPaginationQueryParam.js'
import { depositRequestSchema, withdrawRequestSchema } from '../schema/wallet.schema.js'

export function walletRouter(
    controller: WalletController
): Router {
    const router: Router = Router()
    router.get('/me', controller.getMyWalletInfo)
    router.get('/history', verifyPaginationQuery, controller.getMyWalletHistory)
    router.put('/deposit', verifyRequestBody(depositRequestSchema), controller.deposit)
    router.put('/withdraw', verifyRequestBody(withdrawRequestSchema), controller.withdraw)
    return router
    // router.post('/bank', controller.registerMyBankInfo)
}
