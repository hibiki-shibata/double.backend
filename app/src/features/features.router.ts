import { Router } from 'express'
import { userAuthFeature } from './user/auth/index.js'
import { userAccountFeature } from './user/account/index.js'
import { walletRouter } from './wallet/wallet.router.js'
import { marketRouter } from './market/market.router.js'
import { validateAuth } from '../shared/middleware/validateAuth.js'

export function featuresRouter(): Router {
    const router: Router = Router()
    router.use('/auth', userAuthFeature())
    router.use('/user', validateAuth, userAccountFeature())
    router.use('/wallet', validateAuth, walletRouter)
    router.use('/market', validateAuth, marketRouter)
    return router
}