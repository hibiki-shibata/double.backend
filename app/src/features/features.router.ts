import { Router } from 'express'
import { userRouter } from './user/router/user.router.js'
import { userAuthRouter } from './user/router/userAuth.router.js'
import { walletRouter } from './wallet/wallet.router.js'
import { marketRouter } from './market/market.router.js'
import { validateAuth } from '../shared/middleware/validateAuth.js'

export const featuresRouter: Router = Router()

featuresRouter.use('/auth', userAuthRouter)
featuresRouter.use('/user', validateAuth, userRouter)
featuresRouter.use('/wallet', validateAuth, walletRouter)
featuresRouter.use('/market', validateAuth, marketRouter)