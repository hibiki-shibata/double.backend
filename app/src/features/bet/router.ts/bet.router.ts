// src/features/bet/route/bet.router.ts
import { Router } from 'express';
import type { BetController } from '../controller/bet.controller.js';
import { BET_ROUTES } from '../contract/bet.contract.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { betSchema } from '../schema/bet.schema.js';
import { paginationSchema } from '@global-shared/types/pagination.type.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';


export function betRouter(controller: BetController): Router {
    const router = Router();

    router.post(
        BET_ROUTES.CREATE,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: betSchema.createRequest }),
        controller.createMyBet
    );

    router.put(
        BET_ROUTES.CANCEL,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ params: betSchema.cancelRequest }),
        controller.cancelMyBet
    );

    router.get(
        BET_ROUTES.HISTORY,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ query: paginationSchema }),
        controller.getMyBetHistory
    );

    router.get(
        BET_ROUTES.MARKET_HISTORY,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ query: paginationSchema, params: betSchema.getMarketBetRequestParam }),
        controller.getMyMarketBets
    );

    return router;
}




// import { Router } from "express";
// import type { BetController } from "../controller/bet.controller.js";
// import { verifyQueryParams } from "@global-shared/middleware/verifyQueryParams.js";
// import { paginationSchema } from "@global-shared/types/pagination.type.js";
// import { verifyParams } from "@global-shared/middleware/verifyParams.js";
// import { betSchema } from "../schema/bet.schema.js";
// import { verifyRequestBody } from "@global-shared/middleware/verifyRequestBody.js";

// export function betRouter(
//     controller: BetController
// ): Router {
//     const router = Router()
//     router.post(
//         '/',
//         verifyRequestBody(betSchema.createRequest),
//         controller.createMyBet
//     )
//     router.put(
//         '/:betId',
//         verifyRequestBody(betSchema.cancelRequest),
//         controller.cancelMyBet
//     )
//     router.get(
//         '/history',
//         verifyQueryParams(paginationSchema),
//         controller.getMyBetHistory
//     )
//     router.get(
//         '/history/markets/:marketId',
//         verifyQueryParams(paginationSchema),
//         verifyParams(betSchema.getMarketBetRequestParam),
//         controller.getMyMarketBets
//     )
//     return router
// }