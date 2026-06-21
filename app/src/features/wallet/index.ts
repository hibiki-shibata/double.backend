import type { Router } from "express";
import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { WalletTransactionRepository } from "./repository/walletTransaction/walletTransaction.repository.js";
import type { WalletRepository } from "./repository/wallet/wallet.repository.js";
import type { WalletService } from "./service/wallet.service.js";
import type { WalletController } from "./controller/wallet.controller.js";
import { logger } from "@global-shared/logger/logger.js";
import { cacheKeys, cacheTtlsSec } from "@global-shared/config/cache.config.js";
import { redisClient } from "@global-shared/infra/cache/client/redisClient.js";
import { RedisCacheService } from "@global-shared/infra/cache/service/redis.service.js";
import { prismaClient } from "@global-shared/infra/db/prismaClient.js";
import { PrismaWalletRepository } from "./repository/wallet/prisma.wallet.repository.js";
import { PrismaWalletTransactionRepository } from "./repository/walletTransaction/prisma.walletTransaction.repository.js";
import { CachedWaletTransactionRepository } from "./repository/walletTransaction/cached.walletTransaction.repository.js";
import { CachedWalletRepository } from "./repository/wallet/cached.wallet.repository.js";
import { WalletServiceV1 } from "./service/wallet.service.v1.js";
import { WalletControllerV1 } from "./controller/wallet.controller.v1.js";
import { walletRouter } from "./router/wallet.router.js";

export function walletFeature(): Router {
    const cacheService: CacheService = new RedisCacheService(redisClient, logger)
    const ledgerDBRepository: WalletTransactionRepository = new PrismaWalletTransactionRepository(prismaClient)
    const ledgerRepository: WalletTransactionRepository = new CachedWaletTransactionRepository(ledgerDBRepository, cacheService, cacheKeys, cacheTtlsSec)
    const walletDBRepository: WalletRepository = new PrismaWalletRepository(prismaClient)
    const repository: WalletRepository = new CachedWalletRepository(walletDBRepository, cacheService, cacheKeys, cacheTtlsSec)
    const service: WalletService = new WalletServiceV1(repository, ledgerRepository, prismaClient, logger)
    const controller: WalletController = new WalletControllerV1(service, logger)
    return walletRouter(controller)
}

