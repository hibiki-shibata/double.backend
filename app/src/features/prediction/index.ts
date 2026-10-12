import type { Router } from "express";
import type { PredictionRepository } from "./repository/prediction.repository.js";
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { PredictionService } from "./service/prediction.service.js";
import type { PredictionController } from "./controller/prediction.controller.js";
import { prismaClient } from "@global-shared/infra/db/prismaClient.js";
import { PrismaPredictionRepository } from "./repository/prisma.prediction.repository.js";
import { PredictionServiceV1 } from "./service/prediction.service.v1.js";
import { PredictionControllerV1 } from "./controller/prediction.controller.v1.js";
import { predictionRouter } from "./router/prediction.router.js";
import { CachedPredictionRepository } from "./repository/cached.prediction.repository.js";
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js";
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js";
import { cacheKeys, cacheTtlsSec } from "@global-shared/config/cache.config.js";
import { loggerContext } from "@global-shared/logger/logger.js";

export function PredictionFeature(): Router {
    const cacheSerivice: CacheService = new RedisCacheService(redisClient, loggerContext)
    const dbRepository: PredictionRepository = new PrismaPredictionRepository(prismaClient)
    const cachedRepository: PredictionRepository = new CachedPredictionRepository(dbRepository, cacheSerivice, cacheKeys, cacheTtlsSec)
    const service: PredictionService = new PredictionServiceV1(cachedRepository, loggerContext)
    const controller: PredictionController = new PredictionControllerV1(service, loggerContext)
    return predictionRouter(controller)
}