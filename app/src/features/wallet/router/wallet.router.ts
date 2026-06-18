import { Router } from 'express'
import type { WalletController } from '../controller/wallet.controller.js'

export function walletRouter(
    controller: WalletController
): Router {
    const router: Router = Router()
    router.get('/me', controller.getMyWalletInfo)
    router.get('/history', controller.getMyBalanceHistory)
    router.put('/deposit', controller.deposit)
    router.put('/withdraw', controller.withdraw)
    // router.post('/bank', controller.registerMyBankInfo)
    // router.put('/bank', controller.updateMyBankInfo)
    // router.delete('/bank', controller.deleteMyBankInfo)
    return router
}
