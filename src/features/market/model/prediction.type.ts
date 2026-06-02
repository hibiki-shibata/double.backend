import type { User } from "../../account/model/user.type.js";

export type Prediction = {
    id: string
    market_id: string
    name: string
    bet_sum: number
    is_winner: boolean
    is_resolved: boolean
    resolved_by: User
    created_at: Date
    updated_at: Date
    resolved_at: Date
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
    bet_amount: number
    bet_sum_before: number
    bet_sum_after: number
    created_at: Date
}