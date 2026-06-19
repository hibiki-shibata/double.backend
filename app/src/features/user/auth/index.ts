import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import type { UserAuthService } from "./service/userAuth.service.js"
import type { UserAuthController } from "./controller/userAuth.controller.js"
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js"
import { logger } from "@global-shared/logger/logger.js"
import { PasswordServiceV1 } from "@global-shared/auth/service/password.service.v1.js"
import { prismaClient } from "@global-shared/infra/db/prismaClient.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js"
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js"
import { jwtTokenService } from "@global-shared/auth/index.js"
import { UserAuthServiceV1 } from "./service/userAuth.service.v1.js"
import { cacheKeys } from "@global-shared/config/cache.config.js"
import { CachedUserRepository } from "../shared/repository/cached.user.repository.js"
import { cookieOptions, passwordEncoderOptions } from "@global-shared/config/security.config.js"
import { UserAuthControllerV1 } from "./controller/userAuth.controller.v1.js"
import { userAuthRouter } from "./router/userAuth.router.js"

export function userAuthFeature(): Router {
    const passwordService: PasswordService = new PasswordServiceV1(passwordEncoderOptions)
    const cacheService: CacheService = new RedisCacheService(redisClient, logger)
    const dbRepository: UserRepository = new PrismaUserRepository(prismaClient)
    const repository: UserRepository = new CachedUserRepository(dbRepository, cacheService, cacheKeys)
    const service: UserAuthService = new UserAuthServiceV1(repository, passwordService, jwtTokenService, logger)
    const controller: UserAuthController = new UserAuthControllerV1(service, cookieOptions, logger)
    return userAuthRouter(controller)
}