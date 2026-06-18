import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js"

export interface WalletController {
    getMyWalletInfo(): Promise<Wallet>
    getMyBalanceHistory(): Promise<WalletTransaction[]>
    deposit(): Promise<Wallet>
    withdraw(): Promise<Wallet>
    // registerMyBankInfo(): Promise<void>
    // updateMyBankInfo(): Promise<void>
    // deleteMyBankInfo(): Promise<void>
}