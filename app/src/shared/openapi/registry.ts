// src/openapi/registry.ts
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

export const openApiRegistry = new OpenAPIRegistry();

// Register global components (Security, standard error responses, etc.)
openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

export function buildOpenApiDocument(): any {
    const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);
    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title: 'Production Platform API',
            version: '1.0.0',
        },
        servers: [{ url: '/api/v1' }],
    });
}