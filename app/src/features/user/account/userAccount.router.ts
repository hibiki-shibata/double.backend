import { Router } from 'express'
import { UserAccountController } from './controller/userAccount.controller.js'
import { validateRequestBody } from '../../../shared/middleware/validateRequestBody.js'
import { UserAccountRequest } from './dto/userAccount.dto.js'

export const userAccountRouter: Router = Router()

userAccountRouter.get('/me', UserAccountController.getMyAccount)
userAccountRouter.put('/me', validateRequestBody(UserAccountRequest), UserAccountController.updateMyAccount)
userAccountRouter.delete('/me', UserAccountController.deleteMyAccount)