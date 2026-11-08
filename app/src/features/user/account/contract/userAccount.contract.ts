import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { UserAccountSchema } from "../schema/userAccount.schema.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import { USER_ACCOUNT_ROUTES } from "../router/userAccount.router.js";

// Register components for $ref in OpenAPI docs
const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.USER;


const UserAccountResponseRef = openApiRegistry.register('UserAccountResponse', UserAccountSchema.response);

// Register paths using ENDPOINT_PATH_PREFIX + USER_ACCOUNT_ROUTES
export function registerUserAccountContracts() {
    openApiRegistry.registerPath({
        method: 'get',
        path: toOpenApiPath(`${BASE_PATH}${USER_ACCOUNT_ROUTES.ME}`),
        summary: 'Get current user account',
        tags: ['User Account'],
        security: [{ bearerAuth: [] }],
        responses: {
            200: { description: 'Success', content: { 'application/json': { schema: UserAccountResponseRef } } },
            401: { description: 'Unauthorized' },
            404: { description: 'Not Found' },
        },
    });

    openApiRegistry.registerPath({
        method: 'put',
        path: toOpenApiPath(`${BASE_PATH}${USER_ACCOUNT_ROUTES.ME}`),
        summary: 'Update current user account',
        tags: ['User Account'],
        security: [{ bearerAuth: [] }],
        request: { body: { content: { 'application/json': { schema: UserAccountSchema.editRequest } } } },
        responses: {
            200: { description: 'Updated', content: { 'application/json': { schema: UserAccountResponseRef } } },
            400: { description: 'Bad Request' },
            401: { description: 'Unauthorized' },
        },
    });

    openApiRegistry.registerPath({
        method: 'delete',
        path: toOpenApiPath(`${BASE_PATH}${USER_ACCOUNT_ROUTES.ME}`),
        summary: 'Delete current user account',
        tags: ['User Account'],
        security: [{ bearerAuth: [] }],
        responses: {
            200: { description: 'Deleted' },
            401: { description: 'Unauthorized' },
        },
    });
}

registerUserAccountContracts();