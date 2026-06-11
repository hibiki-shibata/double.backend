import { Router } from 'express'
import { UserAccountController } from '../controller/userAccount.controller.js'
import { reqBodyValidation } from '../../../shared/middleware/reqBodyValidate.js'
import { UserAccountRequestSchema } from '../dto/userAccount.dto.js'

export const userRouter: Router = Router()

userRouter.get('/me', reqBodyValidation(UserAccountRequestSchema),UserAccountController.getMyAccountData)
userRouter.put('/me', UserAccountController.putUpdatedMyAccount)
userRouter.delete('/me', UserAccountController.deleteMyAccount)