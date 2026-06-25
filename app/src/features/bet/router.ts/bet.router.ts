import { Router } from "express";
import type { BetController } from "../controller/bet.controller.js";
import { verifyQueryParams } from "@global-shared/middleware/verifyQueryParams.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import { verifyParams } from "@global-shared/middleware/verifyParams.js";
import { BetSchema } from "../schema/bet.schema.js";
import { verifyRequestBody } from "@global-shared/middleware/verifyRequestBody.js";

export function betRouter(
    controller: BetController
): Router {
    const router = Router()
    router.post(
        '/',
        verifyRequestBody(BetSchema.createRequest),
        controller.createMyBet
    )
    router.put(
        '/:betId',
        verifyRequestBody(BetSchema.cancelRequest),
        controller.cancelMyBet
    )
    router.get(
        '/history',
        verifyQueryParams(paginationSchema),
        controller.getMyBetHistory
    )
    router.get(
        '/history/markets/:marketId',
        verifyQueryParams(paginationSchema),
        verifyParams(BetSchema.getMarketBetRequest),
        controller.getMyMarketBets
    )
    return router
}