import type { Router } from "express";
import type { MarketService } from "./service/market.service.js";
import type { MarketController } from "./controller/market.controller.js";
import { logger } from "@global-shared/logger/logger.js";
import { prismaClient } from "@global-shared/infra/db/prismaClient.js";
import { PrismaMarketRepository } from "./repository/prisma.market.repository.js";
import { MarketServiceV1 } from "./service/market.service.v1.js";
import { MarketControllerV1 } from "./controller/market.controller.v1.js";
import { marketRouter } from "./routeter/market.router.js";

export function marketFeature(): Router {
    const repository = new PrismaMarketRepository(prismaClient)
    const service: MarketService = new MarketServiceV1(repository, logger)
    const controller: MarketController = new MarketControllerV1(service, logger)
    return marketRouter(controller)
}