import { Router } from 'express'
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js'
import { authenticate } from '@global-shared/middleware/authenticate.js'
import { authorize } from '@global-shared/middleware/authorize.js'
import { userAuthFeature } from './user/auth/index.js'
import { userAccountFeature } from './user/account/index.js'
import { walletFeature } from './wallet/index.js'

import { marketRouter } from './market/market.router.js'

export function featuresRouter(): Router {
    const router: Router = Router()
    router.use('/auth', userAuthFeature())
    router.use('/user',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        userAccountFeature
    )
    router.use('/wallet',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        walletFeature
    )
    router.use('/market',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        marketRouter
    )
    return router
}