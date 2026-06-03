import type { User } from "../../account/model/user.type.js"
import type { Currency } from "../../wallet/model/wallet.type.js"

enum BetStatus {
    pending,
    locked,
    won,
    lost,
    payout,
    cancelled
}

export type Bet = {
    id: string
    user: User
    market_id: string
    prediction_id: string
    currency: Currency
    bet_amount: number
    payout_amount: number
    status: BetStatus
    created_at: Date
    updated_at: Date
    version: number
}