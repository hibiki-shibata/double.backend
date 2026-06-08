import { Router } from 'express'
import { userRouter, userAuthRouter } from './user/user.router.js'
import { walletRouter } from './wallet/wallet.router.js'
import { marketRouter } from './market/market.router.js'
import { authValidation } from '../shared/middleware/authValidation.js'

export const featuresRouter: Router = Router()

featuresRouter.use('/user/auth', userAuthRouter)
featuresRouter.use('/user', authValidation, userRouter)
featuresRouter.use('/wallet', authValidation, walletRouter)
featuresRouter.use('/market', authValidation, marketRouter)