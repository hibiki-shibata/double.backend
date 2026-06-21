import { Router } from "express";
import type { MarketController } from "../controller/market.controller.js";
import { verifyParams } from "@global-shared/middleware/verifyParams.js";
import { marketGetRequestSchema } from "../schema/market.schema.js";

export function marketRouter(
    controller: MarketController
): Router {
    const router: Router = Router()
    router.get(
        '/list',
        controller.getListOfAvailableMarket
    )
    router.get(
        '/:marketId',
        verifyParams(marketGetRequestSchema),
        controller.getMarketDetail
    )
    return router
}