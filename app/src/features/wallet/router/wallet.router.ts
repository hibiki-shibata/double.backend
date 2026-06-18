import { Router } from 'express'
import type { WalletController } from '../controller/wallet.controller.js'

export function walletRouter(
    controller: WalletController
): Router {
    const router: Router = Router()
    router.get('/me', controller.getMyWalletInfo)
    router.get('/history', controller.getMyWalletHistory)
    router.put('/deposit', controller.deposit)
    router.put('/withdraw', controller.withdraw)
    // router.post('/bank', controller.registerMyBankInfo)
    return router
}
