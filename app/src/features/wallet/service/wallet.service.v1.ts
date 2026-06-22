import type { Logger } from "pino";
import type { WalletRepository } from "../repository/wallet/wallet.repository.js";
import type { WalletService } from "./wallet.service.js";
import type { WalletTransactionRepository } from "../repository/walletTransaction/walletTransaction.repository.js";
import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import { WalletTransactionType, type PrismaClient, type Wallet, type WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import { InvalidInputErr } from "@global-shared/error/httpErrors.js";

export class WalletServiceV1 implements WalletService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly ledgerRepository: WalletTransactionRepository,
        private readonly prismaClient: PrismaClient,
        private readonly loggerContext: LoggerContext
    ) { }

    async getUserWalletInfo(userId: string): Promise<WalletResponse> {
        const userWallet: Wallet = await this.fetchUserWallet(userId)
        return this.toWalletResponse(userWallet)
    }

    async getUserWalletHistory(
        userId: string, pagenation: Pagination
    ): Promise<WalletTransactionResponse[]> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Fetching user wallet wallet history from DB")

        const wallet: Wallet = await this.fetchUserWallet(userId)

        const walletHistory: WalletTransaction[] = await this.ledgerRepository.getHistoryByWalletId(wallet.id, {
            offset: pagenation.page ? pagenation.page - 1 : 0,
            limit: pagenation.limit ? pagenation.limit : 50
        })

        logger.info("Success Fetching User's wallet history from DB")
        return this.toWalletTransactionResponse(walletHistory)
    }

    async deposit(userId: string, dto: DepositRequest): Promise<WalletResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info(`Depositing ${dto.amount} to wallet balance in DB`)

        if (dto.amount <= 0) throw new InvalidInputErr('amount must be positive')
        // Payment integration
        const walletAfter: Wallet = await this.prismaClient.$transaction(async (tx) => {  // to prevent Race condition
            const walletBefore: Wallet = await this.fetchUserWallet(userId)
            const tempWalletAfter: Wallet = await this.walletRepository.safeDepositBalanceByWalletId(walletBefore.id, tx, {
                amount: dto.amount,
            })
            await this.ledgerRepository.create({
                amount: dto.amount,
                type: WalletTransactionType.DEPOSIT,
                currency: tempWalletAfter.currency,
                balanceAfter: tempWalletAfter.balance,
                balanceBefore: tempWalletAfter.balance - dto.amount,
                walletId: tempWalletAfter.id,
                userId: tempWalletAfter.user_id,
                tx: tx
            })
            return tempWalletAfter
        })
        logger.info(`Success Deposit ${dto.amount} to wallet balance in DB`)
        return this.toWalletResponse(walletAfter)
    }

    async withdraw(userId: string, dto: WithdrawRequest): Promise<WalletResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info(`Withdrawing ${dto.amount} to wallet balance in DB`)

        if (dto.amount <= 0) throw new InvalidInputErr('amount must be positive')
        // Bank integration
        const walletAfter: Wallet = await this.prismaClient.$transaction(async (tx) => {
            const walletBefore: Wallet = await this.fetchUserWallet(userId)
            const tempWalletAfter: Wallet = await this.walletRepository.safeDeductBalanceByWalletId(walletBefore.id, tx, {
                amount: dto.amount
            })
            if (tempWalletAfter.balance < 0) throw new InvalidInputErr('Withdraw amount over your balance')
            await this.ledgerRepository.create({
                amount: dto.amount,
                type: WalletTransactionType.WITHDRAW,
                currency: tempWalletAfter.currency,
                balanceAfter: tempWalletAfter.balance,
                balanceBefore: tempWalletAfter.balance + dto.amount,
                walletId: tempWalletAfter.id,
                userId: tempWalletAfter.user_id,
                tx: tx
            })
            return tempWalletAfter
        })
        logger.info(`Success withdrawing ${dto.amount} to wallet balance in DB`)
        return this.toWalletResponse(walletAfter)
    }

    private async fetchUserWallet(userId: string): Promise<Wallet> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Fetching user wallet data from DB")

        const wallet: Wallet = await this.walletRepository.getByUserId(userId)

        logger.info("Success fetching user wallet data from DB")
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
            updatedAt: wallet.updated_at.toISOString()
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
                createdAt: walletTransaction.created_at.toISOString(),
            })
        })
        return result
    }
}