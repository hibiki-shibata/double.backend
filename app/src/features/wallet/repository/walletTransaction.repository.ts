import type { DefaultArgs } from "@prisma/client/runtime/client"
import type { Currency, WalletTransactionType, PrismaClient, WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js"

export type txPrismaClient = Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">

export type createInput = {
    type: WalletTransactionType,
    currency: Currency,
    amount: bigint,
    balanceAfter: bigint,
    balanceBefore: bigint,
    walletId: string,
    userId: string,
    tx: txPrismaClient
}

export type PaginationInput = {
    offset: number,
    limit: number
}

export interface WalletTransactionRepository {
    create(dto: createInput): Promise<WalletTransaction>
    getHistoryByWalletId(
        walletId: string,
        pagination: PaginationInput
    ): Promise<WalletTransaction[]>
}