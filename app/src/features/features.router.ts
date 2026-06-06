import { Router } from 'express'
import { userRouter } from './user/user.router.js'
import { walletRouter } from './wallet/wallet.router.js'
import { marketRouter } from './market/market.router.js'

export const featuresRouter: Router = Router()

featuresRouter.use('/v1/user', userRouter)
featuresRouter.use('/v1/wallet', walletRouter)
featuresRouter.use('/v1/market', marketRouter)