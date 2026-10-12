import { Router } from "express";
import type { MarketController } from "../controller/market.controller.js";
import { verifyParams } from "@global-shared/middleware/verifyParams.js";
import { MarketSchema } from "../schema/market.schema.js";
import { verifyQueryParams } from "@global-shared/middleware/verifyQueryParams.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";

export function marketRouter(
    controller: MarketController
): Router {
    const router: Router = Router()
    router.get(
        '/list',
        verifyQueryParams(paginationSchema),
        controller.getOpenMarketList
    )
    router.get(
        '/:marketId',
        verifyParams(MarketSchema.getRequestParam),
        controller.getMarketDetail
    )
    return router
}