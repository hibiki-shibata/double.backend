
import type { User } from "../../user/model/user.type.js";
import type { Currency } from "../../wallet/model/wallet.type.js"

export enum PredictionStatus {
    upcoming,
    open,
    resolved,
    won,
    lost,
    cancelled
}

export type Prediction = {
    id: string
    market_id: string
    name: string
    total_participants: number
    bet_sum: number
    currency: Currency
    status: PredictionStatus
    resolved_by: User | undefined
    created_at: Date
    updated_at: Date
    resolved_at: Date | undefined
    version: number
}

export enum PredictionTransactionType {
    bet,
    refund,
    cancel
}

export type PredictionTransaction = {
    id: string
    prediction_id: string
    transaction_type: PredictionTransactionType
    total_participants_before: number
    total_participants_after: number
    bet_amount: number
    currency: Currency
    bet_sum_before: number
    bet_sum_after: number
    created_at: Date
}