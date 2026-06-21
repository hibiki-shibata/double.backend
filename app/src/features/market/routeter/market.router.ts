import { Router } from "express";
import type { MarketController } from "../controller/market.controller.js";

export function marketRouter(
    controller: MarketController
): Router {
    const router: Router = Router()
    router.get('/list', controller.getListOfAvailableMarket)
    router.get('/:marketId', controller.getMarketDetail)
    return router
}