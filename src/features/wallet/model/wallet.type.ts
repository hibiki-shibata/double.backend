export enum WalletStatus {
    active,
    suspended
}

export enum Currency {
    USD,
    EUR,
    JPY
}

export type Wallet = {
    id: string
    user_id: string
    balance: number
    currency: string
    reserved_amount: string
    status: WalletStatus
    version: number
    updated_at: Date
}

export enum WalletTransactionType {
    deposit,
    withdraw,
    bet,
    payout,
    refund,
    cancel
}

export type WalletTransaction = {
    id: string
    wallet_id: string
    prediction_id: string
    transaction_type: WalletTransactionType
    currency: Currency
    amount: number
    balance_before: number
    balance_after: number
    created_at: Date
}