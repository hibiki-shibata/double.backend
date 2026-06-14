import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { PasswordService } from "./service/password.service.js"
import type { UserAuthService } from "./service/userAuth.service.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { PasswordServiceV1 } from "./service/password.service.v1.js"
import { UserAuthServiceV1 } from "./service/userAuth.service.v1.js"
import { passwordEncoderOptions } from "../../../shared/config/security.config.js"
import { jwtTokenService } from "../../../shared/auth/index.js"
import { UserAuthController } from "./controller/userAuth.controller.js"
import { UserAuthRouter } from "./router/userAuth.router.js"

const repository: UserRepository = new PrismaUserRepository()
const passwordService: PasswordService = new PasswordServiceV1(passwordEncoderOptions.saltRound)
const service: UserAuthService = new UserAuthServiceV1(repository, passwordService, jwtTokenService)
const controller = new UserAuthController(service)

export const userAuthRouter: Router = new UserAuthRouter(controller).create()