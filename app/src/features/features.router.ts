import { Router } from 'express'
import { userRouter } from './user/router/user.router.js'
import { userAuthRouter } from './user/router/userAuth.router.js'
import { walletRouter } from './wallet/wallet.router.js'
import { marketRouter } from './market/market.router.js'
import { authValidation } from '../shared/middleware/authValidation.js'

export const featuresRouter: Router = Router()

featuresRouter.use('/auth', userAuthRouter)
featuresRouter.use('/user', authValidation, userRouter)
featuresRouter.use('/wallet', authValidation, walletRouter)
featuresRouter.use('/market', authValidation, marketRouter)