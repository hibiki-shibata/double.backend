// feature index
import { Router } from 'express'

export const featuresRouter: Router = Router()

featuresRouter.use('/v1/user')
featuresRouter.use('/v1/wallet')
featuresRouter.use('/v1/market')