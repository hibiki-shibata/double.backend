import { Router } from 'express';
import type { BetController } from '../controller/bet.controller.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { BetSchema } from '../schema/bet.schema.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

export const BET_ROUTES = {
    CREATE: '/create',
    CANCEL: '/:betId/cancel',
    HISTORY: '/history', // query
} as const;

export function betRouter(controller: BetController): Router {
    const router = Router();

    router.post(
        BET_ROUTES.CREATE,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: BetSchema.createRequest }),
        controller.createMyBet
    );

    router.put(
        BET_ROUTES.CANCEL,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ params: BetSchema.cancelRequest }),
        controller.cancelMyBet
    );

    router.get(
        BET_ROUTES.HISTORY,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ query: BetSchema.getBetHistoryRequestQuery }),
        controller.getMyBetHistory
    );

    return router;
}