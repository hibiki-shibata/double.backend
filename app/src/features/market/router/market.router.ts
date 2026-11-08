import { Router } from 'express';
import type { MarketController } from '../controller/market.controller.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { MarketSchema } from '../schema/market.schema.js';
import { paginationSchema } from '@global-shared/types/pagination.type.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

export const MARKET_ROUTES = {
    LIST: '/list', // query
    GET_BY_ID: '/:marketId',
} as const;


export function marketRouter(
    controller: MarketController
): Router {
    const router = Router();

    router.get(
        MARKET_ROUTES.LIST,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ query: paginationSchema }),
        controller.getOpenMarketList
    );

    router.get(
        MARKET_ROUTES.GET_BY_ID,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ params: MarketSchema.getRequestParam }),
        controller.getMarketDetail
    );

    return router;
}