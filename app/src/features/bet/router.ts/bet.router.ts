import { Router } from 'express';
import type { BetController } from '../controller/bet.controller.js';
import { BET_ROUTES } from '../contract/bet.contract.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { betSchema } from '../schema/bet.schema.js';
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
        validateRequest({ query: betSchema.getBetHistoryRequestQuery }),
        controller.getMyBetHistory
    );

    return router;
}