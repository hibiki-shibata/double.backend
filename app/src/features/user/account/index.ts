import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { UserAccountService } from "./service/userAccount.service.js"
import type { UserAccountController } from "./controller/userAccount.controller.js"
import { logger } from "../../../shared/logger/logger.js"
import { prismaClient } from "../../../shared/infra/db/prismaClient.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { UserAccountServiceV1 } from "./service/userAccount.service.v1.js"
import { UserAccountControllerV1 } from "./controller/userAccount.controller.v1.js"
import { userAccountRouter } from "./router/userAccount.router.js"

export function userAccountFeature(): Router {
    const repository: UserRepository = new PrismaUserRepository(prismaClient)
    const service: UserAccountService = new UserAccountServiceV1(repository, logger)
    const controller: UserAccountController = new UserAccountControllerV1(service, logger)
    return userAccountRouter(controller)
}