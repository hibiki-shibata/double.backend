import type { Router } from "express"
import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import type { UserAccountService } from "./service/userAccount.service.js"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { UserAccountController } from "./controller/userAccount.controller.js"
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js"
import { logger } from "@global-shared/logger/logger.js"
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js"
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js"
import { cacheKeys, cacheTtlsSec } from "@global-shared/config/cache.config.js"
import { prismaClient } from "@global-shared/infra/db/prismaClient.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { CachedUserRepository } from "../shared/repository/cached.user.repository.js"
import { UserAccountServiceV1 } from "./service/userAccount.service.v1.js"
import { UserAccountControllerV1 } from "./controller/userAccount.controller.v1.js"
import { userAccountRouter } from "./router/userAccount.router.js"
import { PasswordServiceV1 } from "@global-shared/auth/service/password.service.v1.js"
import { passwordEncoderOptions } from "@global-shared/config/security.config.js"

export function userAccountFeature(): Router {
    const cacheService: CacheService = new RedisCacheService(redisClient, logger)
    const passwordService: PasswordService = new PasswordServiceV1(passwordEncoderOptions)
    const dbRepository: UserRepository = new PrismaUserRepository(prismaClient)
    const cachedRepository: UserRepository = new CachedUserRepository(dbRepository, cacheService, cacheKeys, cacheTtlsSec)
    const service: UserAccountService = new UserAccountServiceV1(cachedRepository, passwordService, logger)
    const controller: UserAccountController = new UserAccountControllerV1(service, logger)
    return userAccountRouter(controller)
}