import { Router } from 'express';
import type { UserAuthController } from '../controller/userAuth.controller.js';
import { USER_AUTH_ROUTES } from '../contract/userAuth.contract.js';
import { validateRequest } from '@global-shared/middleware/validateRequest.js';
import { userAuthSchema } from '../schema/userAuth.schema.js';
import { authenticate } from '@global-shared/middleware/authenticate.js';
import { authorize } from '@global-shared/middleware/authorize.js';
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js';

export function userAuthRouter(
    controller: UserAuthController
): Router {
    const router = Router();

    router.post(
        USER_AUTH_ROUTES.SIGNUP,
        validateRequest({ body: userAuthSchema.SignupRequest }),
        controller.signup
    );

    router.post(
        USER_AUTH_ROUTES.LOGIN,
        validateRequest({ body: userAuthSchema.loginRequest }),
        controller.login
    );

    router.post(
        USER_AUTH_ROUTES.REFRESH_TOKEN,
        controller.refreshToken
    );

    router.post(
        USER_AUTH_ROUTES.LOGOUT,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        controller.logout
    );

    return router;
}