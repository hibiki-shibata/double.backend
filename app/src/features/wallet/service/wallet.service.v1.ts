import type { Logger } from "pino";
import { WalletTransactionType, type PrismaClient, type Wallet, type WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import type { WalletRepository } from "../repository/wallet.repository.js";
import type { DepositInput, PaginationInput, WalletService, WithdrawInput } from "./wallet.service.js";
import { InvalidInputErr } from "../../../shared/error/httpErrors.js";
import type { WalletTransactionRepository } from "../repository/walletTransaction.repository.js";

export class WalletServiceV1 implements WalletService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly ledgerRepository: WalletTransactionRepository,
        private readonly prismaClient: PrismaClient,
        private readonly log: Logger
    ) { }

    async getUserWalletInfo(userId: string): Promise<Wallet> {
        return await this.fetchUserWallet(userId)
    }

    async getUserBalanceHistory(
        userId: string, pagination: PaginationInput
    ): Promise<WalletTransaction[]> {
        const wallet: Wallet = await this.fetchUserWallet(userId)
        this.log.info({ userId }, "Fetching user wallet wallet history from DB")
        const walletHistory: WalletTransaction[] = await this.ledgerRepository.getHistoryByWalletId(wallet.id, {
            offset: pagination.offset,
            limit: pagination.limit
        }
        )
        this.log.info({ userId }, "Success Fetching User's wallet history from DB")
        return walletHistory
    }

    async deposit(userId: string, dto: DepositInput): Promise<Wallet> {
        if (dto.amount <= 0) throw new InvalidInputErr('amount must be positive')
        this.log.info({ userId }, `Depositing ${dto.amount} to wallet balance in DB`)
        // Payment integration
        const walletAfter: Wallet = await this.prismaClient.$transaction(async (tx) => {  // to prevent Race condition
            const walletBefore: Wallet = await this.fetchUserWallet(userId)
            const tempWalletAfter: Wallet = await this.walletRepository.addBalanceByWalletId(walletBefore.id, tx, {
                amount: dto.amount,
            })
            await this.ledgerRepository.create({
                amount: dto.amount,
                type: WalletTransactionType.deposit,
                currency: tempWalletAfter.currency,
                balanceAfter: tempWalletAfter.balance,
                balanceBefore: tempWalletAfter.balance - dto.amount,
                walletId: tempWalletAfter.id,
                userId: tempWalletAfter.user_id,
                tx: tx
            })
            return tempWalletAfter
        })
        this.log.info({ userId }, `Success Deposit ${dto.amount} to wallet balance in DB`)
        return walletAfter
    }

    async withdraw(userId: string, dto: WithdrawInput): Promise<Wallet> {
        if (dto.amount <= 0) throw new InvalidInputErr('amount must be positive')
        this.log.info({ userId }, `Withdrawing ${dto.amount} to wallet balance in DB`)
        // Bank integration
        const walletAfter: Wallet = await this.prismaClient.$transaction(async (tx) => {
            const walletBefore: Wallet = await this.fetchUserWallet(userId)
            const tempWalletAfter: Wallet = await this.walletRepository.safeDeductBalanceByWalletId(walletBefore.id, tx, {
                amount: dto.amount
            })
            await this.ledgerRepository.create({
                amount: dto.amount,
                type: WalletTransactionType.withdraw,
                currency: tempWalletAfter.currency,
                balanceAfter: tempWalletAfter.balance,
                balanceBefore: tempWalletAfter.balance + dto.amount,
                walletId: tempWalletAfter.id,
                userId: tempWalletAfter.user_id,
                tx: tx
            })
            return tempWalletAfter
        })
        this.log.info({ userId }, `Success withdrawing ${dto.amount} to wallet balance in DB`)
        return walletAfter
    }


    private async fetchUserWallet(userId: string): Promise<Wallet> {
        this.log.info({ userId }, "Fetching user wallet data from DB")
        const wallet: Wallet = await this.walletRepository.getByUserId(userId)
        this.log.info({ userId }, "Success fetching user wallet data from DB")
        return wallet
    }
}