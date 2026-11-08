import { Router } from 'express';
import type { WalletController } from '../controller/wallet.controller.js';
import { WALLET_ROUTES } from '../contract/wallet.contract.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { walletSchema } from '../schema/wallet.schema.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

export function walletRouter(
    controller: WalletController,
): Router {
    const router = Router();

    router.get(
        WALLET_ROUTES.ME,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        controller.getMyWalletInfo
    );

    router.get(
        WALLET_ROUTES.HISTORY,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ query: walletSchema.transactionRequestQuery }),
        controller.getMyWalletHistory
    );

    router.put(
        WALLET_ROUTES.DEPOSIT,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: walletSchema.depositRequest }),
        controller.deposit
    );

    router.put(
        WALLET_ROUTES.WITHDRAW,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: walletSchema.withdrawRequest }),
        controller.withdraw
    );

    return router;
}