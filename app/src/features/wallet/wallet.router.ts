// feature index
import { Router } from 'express'
import { WalletController } from './controller/wallet.controller.js'

export const walletRouter: Router = Router()

walletRouter.post('/wallet/register', WalletController.registerWallet)
walletRouter.put('/auth/deposit', WalletController.depositBalance)
walletRouter.put('/wallet/withdraw', WalletController.withdrawBalance)