import { Router } from 'express'
import { userAccountRouter } from './user/account/index.js'
import { userAuthRouter } from './user/auth/index.js'
import { walletRouter } from './wallet/wallet.router.js'
import { marketRouter } from './market/market.router.js'
import { validateAuth } from '../shared/middleware/validateAuth.js'

export const featuresRouter: Router = Router()

featuresRouter.use('/auth', userAuthRouter)
featuresRouter.use('/user', validateAuth, userAccountRouter)
featuresRouter.use('/wallet', validateAuth, walletRouter)
featuresRouter.use('/market', validateAuth, marketRouter)