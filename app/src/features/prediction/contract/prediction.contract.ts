import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { PredictionSchema } from "../schema/prediction.schema.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import { z } from "zod";

// Register components for $ref in OpenAPI docs
const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.PREDICTION;

export const PREDICTION_ROUTES = {
    GET_BY_MARKET_ID: '/:marketId',
} as const;

const PredictionResponseRef = openApiRegistry.register('PredictionResponse', PredictionSchema.response);

// Register paths using ENDPOINT_PATH_PREFIX + PREDICTION_ROUTES
export function registerPredictionContracts() {
    openApiRegistry.registerPath({
        method: 'get',
        path: toOpenApiPath(`${BASE_PATH}${PREDICTION_ROUTES.GET_BY_MARKET_ID}`),
        summary: 'Get predictions by market ID',
        tags: ['Predictions'],
        security: [{ bearerAuth: [] }],
        request: { params: PredictionSchema.getRequestParam, query: paginationSchema },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: z.object({ items: z.array(PredictionResponseRef), total: z.number() }),
                    },
                },
            },
            400: { description: 'Bad Request' },
            401: { description: 'Unauthorized' },
        },
    });
}

registerPredictionContracts();