import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { walletSchema } from "../schema/wallet.schema.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import { z } from "zod";

// Register components for $ref in OpenAPI docs
const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.WALLET;

export const WALLET_ROUTES = {
  ME: '/me',
  HISTORY: '/history',
  DEPOSIT: '/deposit',
  WITHDRAW: '/withdraw',
} as const;

const WalletResponseRef = openApiRegistry.register('WalletResponse', walletSchema.response);
const WalletTransactionResponseRef = openApiRegistry.register('WalletTransactionResponse', walletSchema.transactionResponse);

// Register paths using ENDPOINT_PATH_PREFIX + WALLET_ROUTES
export function registerWalletContracts() {
  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${BASE_PATH}${WALLET_ROUTES.ME}`),
    summary: 'Get current user wallet info',
    tags: ['Wallet'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Success', content: { 'application/json': { schema: WalletResponseRef } } },
      401: { description: 'Unauthorized' },
      404: { description: 'Not Found' },
    },
  });

  openApiRegistry.registerPath({
    method: 'get',
    path: toOpenApiPath(`${BASE_PATH}${WALLET_ROUTES.HISTORY}`),
    summary: 'Get wallet transaction history',
    tags: ['Wallet'],
    security: [{ bearerAuth: [] }],
    request: { query: paginationSchema },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({ items: z.array(WalletTransactionResponseRef), total: z.number() }),
          },
        },
      },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'put',
    path: toOpenApiPath(`${BASE_PATH}${WALLET_ROUTES.DEPOSIT}`),
    summary: 'Deposit funds into wallet',
    tags: ['Wallet'],
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: walletSchema.depositRequest } } } },
    responses: {
      200: { description: 'Success', content: { 'application/json': { schema: WalletResponseRef } } },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'put',
    path: toOpenApiPath(`${BASE_PATH}${WALLET_ROUTES.WITHDRAW}`),
    summary: 'Withdraw funds from wallet',
    tags: ['Wallet'],
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: walletSchema.withdrawRequest } } } },
    responses: {
      200: { description: 'Success', content: { 'application/json': { schema: WalletResponseRef } } },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  });
}

registerWalletContracts();