import type { DefaultArgs } from "@prisma/client/runtime/client"
import { type Currency, WalletTransactionType, type PrismaClient, type WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js"
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js"

export type txPrismaClient = Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">


export namespace WalletTransactionRepositoryInput {
    export type Create = {
        type: WalletTransactionType,
        currency: Currency,
        amount: bigint,
        balanceAfter: bigint,
        balanceBefore: bigint,
        walletId: string,
        userId: string,
        tx: txPrismaClient
    }

    export type GetHistory = {
        walletId: string,
        paginationInput: PaginationDBInput
    }
}

export interface WalletTransactionRepository {
    create(
        dto: WalletTransactionRepositoryInput.Create
    ): Promise<WalletTransaction>
    getHistory(
        dto: WalletTransactionRepositoryInput.GetHistory
    ): Promise<WalletTransaction[]>
}