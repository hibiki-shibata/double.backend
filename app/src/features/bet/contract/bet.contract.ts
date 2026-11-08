import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { betSchema } from "../schema/bet.schema.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import { z } from "zod";

// Register components for $ref in OpenAPI docs

const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.BET

export const BET_ROUTES = {
  CREATE: '/create',
  CANCEL: '/:betId/cancel',
  HISTORY: '/history',
  MARKET_HISTORY: '/history/markets/:marketId',
} as const;

const BetResponseRef = openApiRegistry.register('BetResponse', betSchema.response);

// 2. Register paths using ENDPOINT_PATH_PREFIX + BET_ROUTES
export function registerBetContracts() {
  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${BASE_PATH}${BET_ROUTES.CREATE}`),
    summary: 'Create a new bet',
    tags: ['Bets'],
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: betSchema.createRequest } } } },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: BetResponseRef } } },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'put',
    path: toOpenApiPath(`${BASE_PATH}${BET_ROUTES.CANCEL}`),
    summary: 'Cancel an existing bet',
    tags: ['Bets'],
    security: [{ bearerAuth: [] }],
    request: { params: betSchema.cancelRequest },
    responses: {
      200: { description: 'Canceled', content: { 'application/json': { schema: BetResponseRef } } },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${BASE_PATH}${BET_ROUTES.HISTORY}`),
    summary: 'Get user bet history',
    tags: ['Bets'],
    security: [{ bearerAuth: [] }],
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
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${BASE_PATH}${BET_ROUTES.MARKET_HISTORY}`),
    summary: 'Get bets by market ID',
    tags: ['Bets'],
    security: [{ bearerAuth: [] }],
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
      401: { description: 'Unauthorized' },
    },
  });
}

registerBetContracts()