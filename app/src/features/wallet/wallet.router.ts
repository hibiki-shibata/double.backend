// feature index
import { Router } from 'express'
import { WalletController } from './controller/wallet.controller.js'

export const walletRouter: Router = Router()

walletRouter.post('/register', WalletController.registerWallet)
walletRouter.put('/deposit', WalletController.depositBalance)
walletRouter.put('/withdraw', WalletController.withdrawBalance)