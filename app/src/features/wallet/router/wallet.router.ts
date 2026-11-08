import { Router } from 'express';
import type { WalletController } from '../controller/wallet.controller.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { WalletSchema } from '../schema/wallet.schema.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

export const WALLET_ROUTES = {
    ME: '/me',
    HISTORY: '/transaction-history', // query
    DEPOSIT: '/deposit',
    WITHDRAW: '/withdraw',
} as const;

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
        validateRequest({ query: WalletSchema.transactionRequestQuery }),
        controller.getMyTransactionHistory
    );

    router.put(
        WALLET_ROUTES.DEPOSIT,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: WalletSchema.depositRequest }),
        controller.deposit
    );

    router.put(
        WALLET_ROUTES.WITHDRAW,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: WalletSchema.withdrawRequest }),
        controller.withdraw
    );

    return router;
}