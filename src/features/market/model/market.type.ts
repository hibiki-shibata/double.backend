export enum MarketStatus {
    upcoming,
    opened,
    closed,
    resolved,
    payout,
    cancelled
}

export type Market = {
    id: string
    title: string
    status: MarketStatus
    closed_at: Date
    updated_at: Date
    resolved_at: Date
}