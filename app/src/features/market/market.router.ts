// feature index
import { Router } from 'express'
import { MarketController } from './controller/market.controller.js'
import { BetController } from './controller/bet.controller.js'

export const marketRouter: Router = Router()

marketRouter.get('/list', MarketController.getMarketList)
marketRouter.get('/:marketId', MarketController.getMarketDetails)

marketRouter.get('/history/me', BetController.getBetHistory)
marketRouter.post('/bet', BetController.postBet)
marketRouter.delete('/bet', BetController.deleteBet)