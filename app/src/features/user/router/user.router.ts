import { Router } from 'express'
import { UserAccountController } from '../controller/userAccount.controller.js'

export const userRouter: Router = Router()

userRouter.get('/me', UserAccountController.getMyAccountData)
userRouter.put('/me', UserAccountController.putUpdatedMyAccount)
userRouter.delete('/me', UserAccountController.deleteMyAccount)