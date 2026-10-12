import type { Router } from "express"
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js"
import type { BetService } from "./service/bet.service.js"
import type { PredictionRepository } from "../prediction/repository/prediction.repository.js"
import type { BetRepository } from "./repository/bet.repository.js"
import type { BetController } from "./controller/bet.controller.js"
import { loggerContext } from "@global-shared/logger/logger.js"
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js"
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js"
import { cacheKeys, cacheTtlsSec } from "@global-shared/config/cache.config.js"
import { prismaClient } from "@global-shared/infra/db/prismaClient.js"
import { PrismaPredictionRepository } from "../prediction/repository/prisma.prediction.repository.js"
import { CachedPredictionRepository } from "../prediction/repository/cached.prediction.repository.js"
import { PrismaBetRepository } from "./repository/prisma.bet.repository.js"
import { CachedBetRepository } from "./repository/cached.bet.repository.js"
import { BetServiceV1 } from "./service/bet.service.v1.js"
import { BetControllerV1 } from "./controller/bet.controller.v1.js"
import { betRouter } from "./router.ts/bet.router.js"
import type { MarketRepository } from "../market/repository/market.repository.js"
import { PrismaMarketRepository } from "../market/repository/prisma.market.repository.js"
import { CachedMarketRepository } from "../market/repository/cached.market.repository.js"

export function betFeature(): Router {
    const cacheService: CacheService = new RedisCacheService(redisClient, loggerContext)
    // Prediction
    const predictionRepository: PredictionRepository = new PrismaPredictionRepository(prismaClient)
    const cachedPredictionRepository: PredictionRepository = new CachedPredictionRepository(predictionRepository, cacheService, cacheKeys, cacheTtlsSec)
    // Market
    const marketRepository: MarketRepository = new PrismaMarketRepository(prismaClient)
    const cachedMarketRepository: MarketRepository = new CachedMarketRepository(marketRepository, cacheService, cacheKeys, cacheTtlsSec)

    const betRepository: BetRepository = new PrismaBetRepository(prismaClient)
    const cachedBetRepository: BetRepository = new CachedBetRepository(betRepository, cacheService, cacheKeys, cacheTtlsSec)
    const Service: BetService = new BetServiceV1(cachedBetRepository, cachedPredictionRepository, cachedMarketRepository, loggerContext)
    const controller: BetController = new BetControllerV1(Service, loggerContext)
    return betRouter(controller)
}