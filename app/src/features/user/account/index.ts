import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { UserAccountService } from "./service/userAccount.service.js"
import type { UserAccountController } from "./controller/userAccount.controller.js"
import type { CacheService } from "../../../shared/infra/cache/service/cache.service.js"
import { logger } from "../../../shared/logger/logger.js"
import { redisClient } from "../../../shared/infra/cache/client/redisClient.js"
import { RedisCacheService } from "../../../shared/infra/cache/service/redis.service.js"
import { cacheKeys } from "../../../shared/config/cache.config.js"
import { prismaClient } from "../../../shared/infra/db/prismaClient.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { CachedUserRepository } from "../shared/repository/cached.user.repository.js"
import { UserAccountServiceV1 } from "./service/userAccount.service.v1.js"
import { UserAccountControllerV1 } from "./controller/userAccount.controller.v1.js"
import { userAccountRouter } from "./router/userAccount.router.js"
import type { PasswordService } from "../../../shared/auth/service/password.service.js"
import { PasswordServiceV1 } from "../../../shared/auth/service/password.service.v1.js"
import { passwordEncoderOptions } from "../../../shared/config/security.config.js"

export function userAccountFeature(): Router {
    const cacheService: CacheService = new RedisCacheService(redisClient, logger)
    const passwordService: PasswordService = new PasswordServiceV1(passwordEncoderOptions)
    const dbRepository: UserRepository = new PrismaUserRepository(prismaClient)
    const repository: UserRepository = new CachedUserRepository(dbRepository, cacheService, cacheKeys)
    const service: UserAccountService = new UserAccountServiceV1(repository, passwordService, logger)
    const controller: UserAccountController = new UserAccountControllerV1(service, logger)
    return userAccountRouter(controller)
}