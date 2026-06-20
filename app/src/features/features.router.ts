import { Router } from 'express'
import { userAuthFeature } from './user/auth/index.js'
import { userAccountFeature } from './user/account/index.js'
import { walletRouter } from './wallet/router/wallet.router.js'
import { marketRouter } from './market/market.router.js'
import { authenticate } from '@global-shared/middleware/authenticate.js'
import { authorize } from '@global-shared/middleware/authorize.js'
import { UserRoles } from '@global-shared/infra/db/generated.prisma/enums.js'

export function featuresRouter(): Router {
    const router: Router = Router()
    router.use('/auth', userAuthFeature())
    router.use('/user',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        userAccountFeature()
    )
    router.use('/wallet',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        walletRouter
    )
    router.use('/market',
        authenticate,
        authorize({ requiredRoles: [UserRoles.user] }),
        marketRouter
    )
    return router
}