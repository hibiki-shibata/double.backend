// feature/bet/contract/bet.contract.ts
import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { betSchema } from "../schema/bet.schema.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import { z } from "zod";
import { ENDPOINT_PATH_PREFIX } from "@global-shared/config/env.config.js";

// Register components so they render as $ref in OpenAPI specs
const BetResponseRef = openApiRegistry.register('BetResponse', betSchema.response);

// 1. Single Source of Truth for Feature Paths (Express format)
export const BET_ROUTES = {
  CREATE: '/bets/create',
  CANCEL: '/bets/:betId/cancel', // Note: Express route parameter matches cancelRequest.betId
  HISTORY: '/bets/history',
  MARKET_HISTORY: '/bets/history/markets/:marketId',
} as const;

// 2. Batch Register all Feature Endpoints into the Global Registry
export function registerBetContracts() {
  // POST /api/v1/bets
  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${ENDPOINT_PATH_PREFIX}${BET_ROUTES.CREATE}`),
    summary: 'Create a new bet',
    tags: ['Bets'],
    request: { body: { content: { 'application/json': { schema: betSchema.createRequest } } } },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: BetResponseRef } } },
    },
  });

  // PUT /api/v1/bets/:betId
  openApiRegistry.registerPath({
    method: 'put',
    path: toOpenApiPath(`${ENDPOINT_PATH_PREFIX}${BET_ROUTES.CANCEL}`),
    summary: 'Cancel an existing bet',
    tags: ['Bets'],
    request: { params: betSchema.cancelRequest },
    responses: {
      200: { description: 'Canceled', content: { 'application/json': { schema: BetResponseRef } } },
    },
  });

  // GET /api/v1/bets/history
  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${ENDPOINT_PATH_PREFIX}${BET_ROUTES.HISTORY}`),
    summary: 'Get user bet history',
    tags: ['Bets'],
    request: { query: paginationSchema },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({ items: z.array(BetResponseRef), total: z.number() }),
          },
        },
      },
    },
  });

  // GET /api/v1/bets/history/markets/:marketId
  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${ENDPOINT_PATH_PREFIX}${BET_ROUTES.MARKET_HISTORY}`),
    summary: 'Get bets by market ID',
    tags: ['Bets'],
    request: { params: betSchema.getMarketBetRequestParam, query: paginationSchema },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({ items: z.array(BetResponseRef), total: z.number() }),
          },
        },
      },
    },
  });
}

