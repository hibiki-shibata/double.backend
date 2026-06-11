import { Router } from 'express'
import { UserAccountController } from './controller/userAccount.controller.js'
import { validateRequestBody } from '../../../shared/middleware/validateRequestBody.js'
import { UserAccountRequestSchema } from './dto/userAccount.dto.js'

export const userAccountRouter: Router = Router()

userAccountRouter.get('/me', UserAccountController.getMyAccountData)

userAccountRouter.put(
    '/me',
    validateRequestBody(UserAccountRequestSchema),
    UserAccountController.putUpdatedMyAccount
)

userAccountRouter.delete('/me', UserAccountController.deleteMyAccount)