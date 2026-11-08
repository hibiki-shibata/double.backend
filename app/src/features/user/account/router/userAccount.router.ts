import { Router } from 'express';
import type { UserAccountController } from '../controller/userAccount.controller.js';
import { USER_ACCOUNT_ROUTES } from '../contract/userAccount.contract.js';
import { userAccountSchema } from '../schema/userAccount.schema.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

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
        validateRequest({ body: userAccountSchema.editRequest }),
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