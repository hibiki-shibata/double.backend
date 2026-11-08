import { Router } from 'express';
import type { UserAccountController } from '../controller/userAccount.controller.js';
import { UserAccountSchema } from '../schema/userAccount.schema.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

export const USER_ACCOUNT_ROUTES = {
    ME: '/me',
} as const;


export function userAccountRouter(
    controller: UserAccountController,
): Router {
    const router = Router();

    router.get(
        USER_ACCOUNT_ROUTES.ME,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        controller.getMyAccount
    );

    router.put(
        USER_ACCOUNT_ROUTES.ME,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ body: UserAccountSchema.editRequest }),
        controller.updateMyAccount
    );

    router.delete(
        USER_ACCOUNT_ROUTES.ME,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        controller.deleteMyAccount
    );

    return router;
}