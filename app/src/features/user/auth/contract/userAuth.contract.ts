import { openApiRegistry } from "@global-shared/openapi/registry.js";
import { toOpenApiPath } from "@global-shared/openapi/toOpenApiPath.js";
import { UserAuthSchema } from "../schema/userAuth.schema.js";
import { ENDPOINT_PATH_PREFIX, FEATURE_PATH_PREFIX } from "@global-shared/config/routePath.config.js";
import { USER_AUTH_ROUTES } from "../router/userAuth.router.js";

// Register components for $ref in OpenAPI docs
const BASE_PATH = ENDPOINT_PATH_PREFIX + FEATURE_PATH_PREFIX.AUTH;


const AccessTokenResponseRef = openApiRegistry.register('AccessTokenResponse', UserAuthSchema.accessTokenResponse);
const JwtTokensRef = openApiRegistry.register('JwtTokens', UserAuthSchema.jwtTokens);

// Register paths using ENDPOINT_PATH_PREFIX + USER_AUTH_ROUTES
export function registerUserAuthContracts() {
  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${BASE_PATH}${USER_AUTH_ROUTES.SIGNUP}`),
    summary: 'User signup',
    tags: ['User Auth'],
    request: { body: { content: { 'application/json': { schema: UserAuthSchema.SignupRequest } } } },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: JwtTokensRef } } },
      400: { description: 'Bad Request' },
    },
  });

  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${BASE_PATH}${USER_AUTH_ROUTES.LOGIN}`),
    summary: 'User login',
    tags: ['User Auth'],
    request: { body: { content: { 'application/json': { schema: UserAuthSchema.loginRequest } } } },
    responses: {
      200: { description: 'Success', content: { 'application/json': { schema: JwtTokensRef } } },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${BASE_PATH}${USER_AUTH_ROUTES.REFRESH_TOKEN}`),
    summary: 'Refresh access token',
    tags: ['User Auth'],
    responses: {
      200: { description: 'Success', content: { 'application/json': { schema: AccessTokenResponseRef } } },
      401: { description: 'Unauthorized' },
    },
  });

  openApiRegistry.registerPath({
    method: 'post',
    path: toOpenApiPath(`${BASE_PATH}${USER_AUTH_ROUTES.LOGOUT}`),
    summary: 'User logout',
    tags: ['User Auth'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Success' },
      401: { description: 'Unauthorized' },
    },
  });
}

registerUserAuthContracts();