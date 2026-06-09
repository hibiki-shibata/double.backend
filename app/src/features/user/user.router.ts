import { Router } from 'express'
import { UserAuthController } from './controller/userAuth.controller.js'
import { UserAccountController } from './controller/userAccount.controller.js'
import { authValidation } from '../../shared/middleware/authValidation.js'

export const userAuthRouter: Router = Router()
export const userRouter: Router = Router()

userAuthRouter.post('/login', UserAuthController.login)
userAuthRouter.post('/signup', UserAuthController.signup)
userAuthRouter.post('/refreshToken', UserAuthController.refreshToken)
userAuthRouter.post('/logout', authValidation, UserAuthController.logout)

userRouter.get('/me', UserAccountController.getMyAccountData)
userRouter.put('/me', UserAccountController.putUpdatedMyAccount)
userRouter.delete('/me', UserAccountController.deleteMyAccount)