
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
    user_id: string
    market_id: string
    outcome_id: string
    bet_amount: number
    payout_amount: number
    status: BetStatus
    created_at: Date
    updated_at: Date
    version: number
}