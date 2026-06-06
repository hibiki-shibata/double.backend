// feature index
import { Router } from 'express'
import { MarketController } from './controller/market.controller.js'
import { BetController } from './controller/bet.controller.js'

export const marketRouter: Router = Router()

marketRouter.get('/market/list', MarketController.getMarketList)
marketRouter.get('/market/:marketId', MarketController.getMarketDetails)

marketRouter.get('/market/history/me', BetController.getBetHistory)
marketRouter.post('/market/bet', BetController.postBet)
marketRouter.delete('/market/bet', BetController.deleteBet)