import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { BetSchema } from "../schema/bet.schema.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import z from "zod";
import { BET_ROUTES } from "../router.ts/bet.router.js";

const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.BET;

export function registerBetContracts() {
  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${BASE_PATH}${BET_ROUTES.CREATE}`),
    summary: 'Create a new bet',
    tags: ['Bets'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: { 'application/json': { schema: BetSchema.createRequest } }
      }
    },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: BetSchema.response } } },
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
    request: {
      params: BetSchema.cancelRequest
    },
    responses: {
      200: { description: 'Canceled', content: { 'application/json': { schema: BetSchema.response } } },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${BASE_PATH}${BET_ROUTES.HISTORY}`),
    summary: 'Get user bet history (supports optional market filtering)',
    tags: ['Bets'],
    security: [{ bearerAuth: [] }],
    request: {
      query: BetSchema.getBetHistoryRequestQuery,
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': { schema: z.array(BetSchema.response) },
        },
      },
      401: { description: 'Unauthorized' },
    },
  });
}

registerBetContracts();