import type { Router } from "express";
import type { MarketRepository } from "./repository/market.repository.js";
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { MarketService } from "./service/market.service.js";
import type { MarketController } from "./controller/market.controller.js";
import { prismaClient } from "@global-shared/infra/db/prismaClient.js";
import { PrismaMarketRepository } from "./repository/prisma.market.repository.js";
import { MarketServiceV1 } from "./service/market.service.v1.js";
import { MarketControllerV1 } from "./controller/market.controller.v1.js";
import { marketRouter } from "./routeter/market.router.js";
import { CachedMarketRepository } from "./repository/cached.market.repository.js";
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js";
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js";
import { cacheKeys, cacheTtlsSec } from "@global-shared/config/cache.config.js";
import { loggerContext } from "@global-shared/logger/logger.js";

export function marketFeature(): Router {
    const cacheSerivice: CacheService = new RedisCacheService(redisClient, loggerContext)
    const dbRepository: MarketRepository = new PrismaMarketRepository(prismaClient)
    const cachedRepository: MarketRepository = new CachedMarketRepository(dbRepository, cacheSerivice, cacheKeys, cacheTtlsSec)
    const service: MarketService = new MarketServiceV1(cachedRepository, loggerContext)
    const controller: MarketController = new MarketControllerV1(service, loggerContext)
    return marketRouter(controller)
}