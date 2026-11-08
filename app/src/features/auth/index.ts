import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { PasswordService } from "@global-shared/auth/service/password.service.js"
import type { authService } from "./service/auth.service.js"
import type { authController } from "./controller/auth.controller.js"
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js"
import { logger } from "@global-shared/logger/logger.js"
import { PasswordServiceV1 } from "@global-shared/auth/service/password.service.v1.js"
import { prismaClient } from "@global-shared/infra/db/prismaClient.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js"
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js"
import { jwtTokenService } from "@global-shared/auth/index.js"
import { authServiceV1 } from "./service/auth.service.v1.js"
import { cacheKeys, cacheTtlsSec } from "@global-shared/config/cache.config.js"
import { CachedUserRepository } from "../shared/repository/cached.user.repository.js"
import { cookieOptions, passwordEncoderOptions } from "@global-shared/config/security.config.js"
import { authControllerV1 } from "./controller/auth.controller.v1.js"
import { authRouter } from "../../auth/router/auth.router.js"

export function authFeature(): Router {
    const passwordService: PasswordService = new PasswordServiceV1(passwordEncoderOptions)
    const cacheService: CacheService = new RedisCacheService(redisClient, logger)
    const dbRepository: UserRepository = new PrismaUserRepository(prismaClient)
    const repository: UserRepository = new CachedUserRepository(dbRepository, cacheService, cacheKeys, cacheTtlsSec)
    const service: authService = new authServiceV1(repository, passwordService, jwtTokenService, logger)
    const controller: authController = new authControllerV1(service, cookieOptions, logger)
    return authRouter(controller)
}