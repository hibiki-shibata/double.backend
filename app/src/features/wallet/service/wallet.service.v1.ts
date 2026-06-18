import type { Logger } from "pino";
import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import type { WalletRepository } from "../repository/wallet.repository.js";
import type { WalletService } from "./wallet.service.js";
import { InvalidInputErr } from "../../../shared/error/httpErrors.js";

export class WalletServiceV1 implements WalletService {
    constructor(
        private readonly repository: WalletRepository,
        private readonly log: Logger
    ) { }

    async getWalletByUserId(userId: string): Promise<Wallet> {
        return await this.fetchUserWallet(userId)
    }

    async getUserBalanceHistory(
        userId: string, offset: number, limit: number
    ): Promise<WalletTransaction[]> {
        const wallet: Wallet = await this.fetchUserWallet(userId)
        this.log.info({ userId }, "Fetching User's wallet history from DB")
        const walletHistory: WalletTransaction[] = await this.repository.getBalanceHistory(
            wallet.id,
            offset,
            limit,
        )
        this.log.info({ userId }, "Fetched User's wallet history from DB")
        return walletHistory
    }

    async deposit(userId: string, amount: bigint): Promise<Wallet> {
        // Race condition
        // Payment integration
        // insufficient balance check
        const wallet: Wallet = await this.fetchUserWallet(userId)
        const balanceAfter: bigint = wallet.balance + amount
        this.log.info({ userId }, `Depositing User's wallet balance from ${wallet.balance} in DB`)
        const walletAfter: Wallet = await this.repository.update(
            wallet.id,
            balanceAfter
        )
        this.log.info({ userId }, `Deposited User's wallet balance to ${balanceAfter} in DB`)
        return walletAfter
    }

    async withdraw(userId: string, amount: bigint): Promise<Wallet> {
        // insufficient balance check
        // race condition
        // Bank integration
        // ACID
        const wallet: Wallet = await this.fetchUserWallet(userId)
        const isCurrentBalanceSufficient: boolean = (wallet.balance - (wallet.reserved_amount + amount)) >= 0
        if(!isCurrentBalanceSufficient) throw new InvalidInputErr('Insufficnent balance to withdraw')
        const balanceAfter: bigint = wallet.balance - amount
        this.log.info({ userId }, `Withdrawing User's wallet balance from ${wallet.balance} in DB`)
        const walletAfter: Wallet = await this.repository.update(
            wallet.id,
            balanceAfter
        )
        this.log.info({ userId }, `Deposited User's wallet balance to ${balanceAfter} in DB`)
        return walletAfter
    }


    private async fetchUserWallet(userId: string): Promise<Wallet> {
        this.log.info({ userId }, "Fetching User's Wallet from DB")
        const wallet: Wallet = await this.repository.getByUserId(userId)
        this.log.info({ userId }, "Fetched User's Wallet from DB")
        return wallet
    }
}