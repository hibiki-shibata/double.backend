import { Router } from 'express'
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js'
import { authenticate } from '@global-shared/middleware/authenticate.js'
import { authorize } from '@global-shared/middleware/authorize.js'
import { userAuthFeature } from './user/auth/index.js'
import { userAccountFeature } from './user/account/index.js'
import { walletFeature } from './wallet/index.js'
import { marketFeature } from './market/index.js'

export function featuresRouter(): Router {
    const router: Router = Router()
    router.use('/market',
        marketFeature
    )
    router.use(
        '/auth',
        userAuthFeature()
    )
    router.use(
        '/user',
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        userAccountFeature()
    )
    router.use(
        '/wallet',
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        walletFeature()
    )
    router.use(
        '/bet',
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        userAuthFeature()
    )
    return router
}