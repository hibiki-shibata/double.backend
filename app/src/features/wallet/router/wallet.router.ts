import { Router } from 'express'
import type { WalletController } from '../controller/wallet.controller.js'
import { verifyRequestBody } from '@global-shared/middleware/verifyRequestBody.js'
import { verifyQueryParams } from '@global-shared/middleware/verifyQueryParams.js'
import { walletSchema } from '../schema/wallet.schema.js'
import { paginationSchema } from '@global-shared/types/pagination.type.js'

export function walletRouter(
    controller: WalletController,
): Router {
    const router: Router = Router()
    router.get(
        '/me',
        controller.getMyWalletInfo
    )
    router.get(
        '/history',
        verifyQueryParams(paginationSchema),
        controller.getMyWalletHistory
    )
    router.put(
        '/deposit',
        verifyRequestBody(walletSchema.depositRequest),
        controller.deposit
    )
    router.put(
        '/withdraw',
        verifyRequestBody(walletSchema.withdrawRequest),
        controller.withdraw)
    return router
}
