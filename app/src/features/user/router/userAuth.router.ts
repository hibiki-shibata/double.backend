import { Router } from 'express'
import { UserAuthController } from '../controller/userAuth.controller.js'
import { authValidation } from '../../../shared/middleware/authValidation.js'

export const userAuthRouter: Router = Router()

userAuthRouter.post('/login', UserAuthController.login)
userAuthRouter.post('/signup', UserAuthController.signup)
userAuthRouter.post('/refreshToken', UserAuthController.refreshToken)
userAuthRouter.post('/logout', authValidation, UserAuthController.logout)