import type { Market, MarketStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";

export interface MarketRepository {
    getById(marketId: string): Promise<Market>
    getByStatus(status: MarketStatus, pagination: Pagination): Promise<Market[]>
}