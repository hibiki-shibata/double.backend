import { Router } from 'express'
import { UserAccountController } from '../controller/userAccount.controller.js'
import { validateRequestBody } from '../../../shared/middleware/validateRequestBody.js'
import { UserAccountRequestSchema } from '../dto/userAccount.dto.js'

export const userRouter: Router = Router()

userRouter.get('/me', UserAccountController.getMyAccountData)

userRouter.put(
    '/me',
    validateRequestBody(UserAccountRequestSchema),
    UserAccountController.putUpdatedMyAccount
)

userRouter.delete('/me', UserAccountController.deleteMyAccount)