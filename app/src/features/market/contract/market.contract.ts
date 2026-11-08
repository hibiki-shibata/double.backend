import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { MarketSchema } from "../schema/market.schema.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import { z } from "zod";

// Register components for $ref in OpenAPI docs
const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.MARKET;

export const MARKET_ROUTES = {
    GET_BY_ID: '/:marketId',
    LIST: '/',
} as const;

const MarketResponseRef = openApiRegistry.register('MarketResponse', MarketSchema.response);

// Register paths using ENDPOINT_PATH_PREFIX + MARKET_ROUTES
export function registerMarketContracts() {
    openApiRegistry.registerPath({
        method: 'get',
        path: toOpenApiPath(`${BASE_PATH}${MARKET_ROUTES.GET_BY_ID}`),
        summary: 'Get market by ID',
        tags: ['Markets'],
        // security: [{ bearerAuth: [] }],
        request: { params: MarketSchema.getRequestParam },
        responses: {
            200: { description: 'Success', content: { 'application/json': { schema: MarketResponseRef } } },
            400: { description: 'Bad Request' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not Found' },
        },
    });

    openApiRegistry.registerPath({
        method: 'get',
        path: toOpenApiPath(`${BASE_PATH}${MARKET_ROUTES.LIST}`),
        summary: 'Get market list',
        tags: ['Markets'],
        // security: [{ bearerAuth: [] }],
        request: { query: paginationSchema },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: z.object({ items: z.array(MarketResponseRef), total: z.number() }),
                    },
                },
            },
            401: { description: 'Unauthorized' },
        },
    });
}

registerMarketContracts();