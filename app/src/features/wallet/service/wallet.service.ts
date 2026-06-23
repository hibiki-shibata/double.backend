import type { Pagination } from "@global-shared/types/pagination.type.js"
import type { WalletResponse, WalletTransactionResponse } from "../schema/wallet.schema.js"

export namespace WalletServiceParams {
    export type GetWalletDetail = {
        userId: string
    }

    export type GetWalletHistory = {
        userId: string,
        pagination: Pagination
    }

    export type Deposit = {
        userId: string,
        amount: bigint
    }

    export type Withdraw = {
        userId: string,
        amount: bigint
    }
}

export interface WalletService {
    getWalletDetail(dto: WalletServiceParams.GetWalletDetail): Promise<WalletResponse>
    getWalletHistory(dto: WalletServiceParams.GetWalletHistory): Promise<WalletTransactionResponse[]>
    deposit(dto: WalletServiceParams.Deposit): Promise<WalletResponse>
    withdraw(dto: WalletServiceParams.Withdraw): Promise<WalletResponse>
}
// Note: registerBankInfo(): Promise<void>

