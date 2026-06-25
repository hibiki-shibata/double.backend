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

    // Make sure DB repositories when you change this params in the future!!
    export type GetMany = {
        userId: string,
        walletId?: string | null,
        paginationInput: PaginationDBInput
    }
}

export interface WalletTransactionRepository {
    create(
        dto: WalletTransactionRepositoryInput.Create
    ): Promise<WalletTransaction>
    getMany(
        dto: WalletTransactionRepositoryInput.GetMany
    ): Promise<WalletTransaction[]>
}