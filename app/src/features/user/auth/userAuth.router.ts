import { Router } from 'express'
import { validateRequestBody } from '../../../shared/middleware/validateRequestBody.js'
import { validateAuth } from '../../../shared/middleware/validateAuth.js'
import { UserLoginRequest, UserSignupRequest } from './dto/userAuth.dto.js'
import { UserAuthController } from './controller/userAuth.controller.js'

export const userAuthRouter: Router = Router()

userAuthRouter.post('/login', validateRequestBody(UserLoginRequest), UserAuthController.login)
userAuthRouter.post('/signup', validateRequestBody(UserSignupRequest), UserAuthController.signup)
userAuthRouter.post('/refreshToken', UserAuthController.refreshToken)
userAuthRouter.post('/logout', validateAuth, UserAuthController.logout)