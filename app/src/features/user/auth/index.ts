import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { PasswordService } from "./service/password.service.js"
import type { UserAuthService } from "./service/userAuth.service.js"
import type { UserAuthController } from "./controller/userAuth.controller.js"
import { logger } from "../../../shared/logger/logger.js"
import { prismaClient } from "../../../shared/infra/db/prismaClient.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { cookieOptions, passwordEncoderOptions } from "../../../shared/config/security.config.js"
import { jwtTokenService } from "../../../shared/auth/index.js"
import { PasswordServiceV1 } from "./service/password.service.v1.js"
import { UserAuthServiceV1 } from "./service/userAuth.service.v1.js"
import { UserAuthControllerV1 } from "./controller/userAuth.controller.v1.js"
import { userAuthRouter } from "./router/userAuth.router.js"

export function userAuthFeature(): Router {
    const repository: UserRepository = new PrismaUserRepository(prismaClient)
    const passwordService: PasswordService = new PasswordServiceV1(passwordEncoderOptions)
    const service: UserAuthService = new UserAuthServiceV1(repository, passwordService, jwtTokenService, logger)
    const controller: UserAuthController = new UserAuthControllerV1(service, cookieOptions, logger)
    return userAuthRouter(controller)
}