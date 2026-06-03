// feature index
import { Router } from 'express'
import { UserAuthController } from './user/controller/userAuthController.js'

export const featuresRouter: Router = Router()
const userAuthController = new UserAuthController()

featuresRouter.use('/v1/user', userAuthController.login)
featuresRouter.use('/v1/wallet', userAuthController.signup)
featuresRouter.use('/v1/market', userAuthController.refreshToken)