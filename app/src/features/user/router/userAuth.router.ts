import { Router } from 'express'
import { UserAuthController } from '../controller/userAuth.controller.js'
import { validateAuth } from '../../../shared/middleware/validateAuth.js'
import { validateRequestBody } from '../../../shared/middleware/validateRequestBody.js'
import { UserLoginRequestSchema, UserSignupRequestSchema } from '../dto/userAuth.dto.js'


export const userAuthRouter: Router = Router()

userAuthRouter.post('/login', validateRequestBody(UserLoginRequestSchema), UserAuthController.login)
userAuthRouter.post('/signup', validateRequestBody(UserSignupRequestSchema), UserAuthController.signup)
userAuthRouter.post('/refreshToken', UserAuthController.refreshToken)
userAuthRouter.post('/logout', validateAuth, UserAuthController.logout)