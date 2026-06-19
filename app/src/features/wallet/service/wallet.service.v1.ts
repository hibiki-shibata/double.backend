import type { Logger } from "pino";
import { WalletTransactionType, type PrismaClient, type Wallet, type WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import type { WalletRepository } from "../repository/wallet.repository.js";
import type { WalletService } from "./wallet.service.js";
import { InvalidInputErr } from "../../../shared/error/httpErrors.js";
import type { WalletTransactionRepository } from "../repository/walletTransaction.repository.js";
import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js";

export class WalletServiceV1 implements WalletService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly ledgerRepository: WalletTransactionRepository,
        private readonly prismaClient: PrismaClient,
        private readonly log: Logger
    ) { }

    async getUserWalletInfo(userId: string): Promise<WalletResponse> {
        const userWallet: Wallet = await this.fetchUserWallet(userId)
        return this.toWalletResponse(userWallet)
    }

    async getUserWalletHistory(
        userId: string, page: number = 0, limit: number = 50
    ): Promise<WalletTransactionResponse[]> {
        const wallet: Wallet = await this.fetchUserWallet(userId)
        this.log.info({ userId }, "Fetching user wallet wallet history from DB")
        const walletHistory: WalletTransaction[] = await this.ledgerRepository.getHistoryByWalletId(wallet.id, {
            offset: page,
            limit: limit
        })
        this.log.info({ userId }, "Success Fetching User's wallet history from DB")
        return this.toWalletTransactionResponse(walletHistory)
    }

    async deposit(userId: string, dto: DepositRequest): Promise<WalletResponse> {
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
        return this.toWalletResponse(walletAfter)
    }

    async withdraw(userId: string, dto: WithdrawRequest): Promise<WalletResponse> {
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
        return this.toWalletResponse(walletAfter)
    }

    private async fetchUserWallet(userId: string): Promise<Wallet> {
        this.log.info({ userId }, "Fetching user wallet data from DB")
        const wallet: Wallet = await this.walletRepository.getByUserId(userId)
        this.log.info({ userId }, "Success fetching user wallet data from DB")
        return wallet
    }

    private toWalletResponse(wallet: Wallet): WalletResponse {
        return {
            id: wallet.id,
            userId: wallet.user_id,
            balance: wallet.balance,
            reservedAmount: wallet.reserved_amount,
            currency: wallet.currency,
            status: wallet.status,
            updatedAt: wallet.updated_at
        }
    }

    private toWalletTransactionResponse(walletHistories: WalletTransaction[]): WalletTransactionResponse[] {
        const result: WalletTransactionResponse[] = []
        walletHistories.forEach((walletTransaction) => {
            result.push({
                id: walletTransaction.id,
                userId: walletTransaction.user_id,
                walletId: walletTransaction.wallet_id,
                predictionId: walletTransaction.prediction_id ?? "No prediction Id",
                type: walletTransaction.type,
                amount: walletTransaction.amount,
                balanceBefore: walletTransaction.balance_before,
                balanceAfter: walletTransaction.balance_after,
                createdAt: walletTransaction.created_at,
            })
        })
        return result
    }
}