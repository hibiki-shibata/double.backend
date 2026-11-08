import { Router } from 'express'
import { userAuthFeature } from './user/auth/index.js'
import { userAccountFeature } from './user/account/index.js'
import { walletFeature } from './wallet/index.js'
import { marketFeature } from './market/index.js'
import { betFeature } from './bet/index.js'
import { PredictionFeature } from './prediction/index.js'

export const FEATURE_PATH_PREFIX = {
    MARKET: '/market',
    PREDICTION: '/prediction',
    AUTH: '/auth',
    USER: '/user',
    WALLET: '/wallet',
    BET: '/bet',
} as const;

export function featuresRouter(): Router {
    const router: Router = Router()
    router.use(FEATURE_PATH_PREFIX.MARKET, marketFeature)
    router.use(FEATURE_PATH_PREFIX.PREDICTION, PredictionFeature)
    router.use(FEATURE_PATH_PREFIX.AUTH, userAuthFeature)
    router.use(FEATURE_PATH_PREFIX.USER, userAccountFeature)
    router.use(FEATURE_PATH_PREFIX.WALLET, walletFeature)
    router.use(FEATURE_PATH_PREFIX.BET, betFeature)
    return router
}