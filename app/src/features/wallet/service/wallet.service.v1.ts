import type { Logger } from "pino";
import type { WalletRepository } from "../repository/wallet/wallet.repository.js";
import type { WalletService, WalletServiceParams } from "./wallet.service.js";
import type { WalletTransactionRepository } from "../repository/walletTransaction/walletTransaction.repository.js";
import type { WalletResponse, WalletTransactionResponse } from "../schema/wallet.schema.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { PrismaClient, Wallet, WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js";
import { WalletStatus, WalletTransactionType } from "@global-shared/infra/db/generated.prisma/enums.js"
import { InvalidInputErr } from "@global-shared/error/httpErrors.js";

export class WalletServiceV1 implements WalletService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly ledgerRepository: WalletTransactionRepository,
        private readonly prismaClient: PrismaClient,
        private readonly loggerContext: LoggerContext
    ) { }

    async getWalletDetail(
        dto: WalletServiceParams.GetWalletDetail
    ): Promise<WalletResponse> {
        const userWallet: Wallet = await this.fetchActiveWalletByUserId(dto.userId)
        return this.toWalletResponse(userWallet)
    }

    async getWalletHistory(
        dto: WalletServiceParams.GetWalletHistory
    ): Promise<WalletTransactionResponse[]> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Fetching user wallet wallet history from DB")

        const wallet: Wallet = await this.fetchActiveWalletByUserId(dto.userId)

        const walletHistory: WalletTransaction[] = await this.ledgerRepository.getMany({
            userId: dto.userId,
            walletId: wallet.id,
            paginationInput: {
                offset: (Math.abs(dto.pagination.page) <= 100) ? dto.pagination.page : 0,
                limit: (Math.abs(dto.pagination.limit) <= 50) ? dto.pagination.limit : 30
            }
        })

        logger.info("Success Fetching User's wallet history from DB")
        return this.toWalletTransactionResponse(walletHistory)
    }

    async deposit(
        dto: WalletServiceParams.Deposit
    ): Promise<WalletResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info(`Depositing ${dto.amount} to wallet balance in DB`)

        if (dto.amount <= 0) throw new InvalidInputErr('amount must be positive')
        // Payment integration
        const walletAfter: Wallet = await this.prismaClient.$transaction(async (tx) => {  // to prevent Race condition
            const walletBefore: Wallet = await this.fetchActiveWalletByUserId(dto.userId)
            if (walletBefore.status !== WalletStatus.ACTIVE) throw new InvalidInputErr('Wallet is currently unavailable for transactions')
            const tempWalletAfter: Wallet = await this.walletRepository.safeDepositBalance({
                amount: dto.amount,
                walletId: walletBefore.id,
                tx: tx,
            })
            await this.ledgerRepository.create({
                amount: dto.amount,
                type: WalletTransactionType.DEPOSIT,
                currency: tempWalletAfter.currency,
                balanceAfter: tempWalletAfter.balance,
                balanceBefore: walletBefore.balance,
                walletId: tempWalletAfter.id,
                userId: tempWalletAfter.user_id,
                tx: tx
            })
            return tempWalletAfter
        })
        logger.info(`Success Deposit ${dto.amount} to wallet balance in DB`)
        return this.toWalletResponse(walletAfter)
    }

    async withdraw(
        dto: WalletServiceParams.Withdraw
    ): Promise<WalletResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info(`Withdrawing ${dto.amount} to wallet balance in DB`)

        if (dto.amount <= 0) throw new InvalidInputErr('amount must be positive')
        // Bank integration
        const walletAfter: Wallet = await this.prismaClient.$transaction(async (tx) => {
            const walletBefore: Wallet = await this.fetchActiveWalletByUserId(dto.userId)
            if (walletBefore.status !== WalletStatus.ACTIVE) throw new InvalidInputErr('Wallet is currently unavailable for transactions')
            const tempWalletAfter: Wallet = await this.walletRepository.safeWithdrawBalance({
                amount: dto.amount,
                walletId: walletBefore.id,
                tx: tx,
            })
            if (tempWalletAfter.balance < 0) throw new InvalidInputErr('Withdraw amount over your balance')
            await this.ledgerRepository.create({
                amount: dto.amount,
                type: WalletTransactionType.WITHDRAW,
                currency: tempWalletAfter.currency,
                balanceAfter: tempWalletAfter.balance,
                balanceBefore: walletBefore.balance,
                walletId: tempWalletAfter.id,
                userId: tempWalletAfter.user_id,
                tx: tx
            })
            return tempWalletAfter
        })
        logger.info(`Success withdrawing ${dto.amount} to wallet balance in DB`)
        return this.toWalletResponse(walletAfter)
    }

    private async fetchActiveWalletByUserId(userId: string): Promise<Wallet> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Fetching user wallet data from DB")

        const userWallet: Wallet = await this.walletRepository.getByUserId(userId)
        if (userWallet.status !== WalletStatus.ACTIVE) throw new InvalidInputErr('Wallet is currently suspended')

        logger.info("Success fetching user wallet data from DB")
        return userWallet
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

    private toWalletTransactionResponse(walletHistory: WalletTransaction[]): WalletTransactionResponse[] {
        const result: WalletTransactionResponse[] = []
        walletHistory.forEach((walletTransaction) => {
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