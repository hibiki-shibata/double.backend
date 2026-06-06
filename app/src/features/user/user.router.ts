import { Router } from 'express'
import { UserAuthController } from './controller/userAuth.controller.js'
import { UserAccountController } from './controller/userAccount.controller.js'

export const userRouter: Router = Router()

userRouter.post('/auth/login', UserAuthController.login)
userRouter.post('/auth/signup', UserAuthController.signup)
userRouter.post('/auth/logout', UserAuthController.logout)
userRouter.post('/auth/refreshToken', UserAuthController.refreshToken)

userRouter.get('/account/me', UserAccountController.getMyAccountData)
userRouter.put('/account/me', UserAccountController.putUpdatedMyAccount)
userRouter.delete('/account/me', UserAccountController.deleteMyAccount)