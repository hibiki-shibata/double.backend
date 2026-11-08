import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { openApiRegistry } from '@global-shared/openapi/registry.js';
// Import your feature contract files so they execute and register their paths
import '../../features/user/auth/contract/userAuth.contract.js';
import '../../features/user/account/contract/userAccount.contract.js';
import '../../features/market/contract/market.contract.js';
import '../../features/prediction/contract/prediction.contract.js';
import '../../features/bet/contract/bet.contract.js';
import '../../features/wallet/contract/wallet.contract.js';

function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Double Backend API',
      version: '1.0.0',
      description: 'API documentation for Double platform',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT',
    //     },
    //   },
    // },
  });

  const outputPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf-8');
  console.log(`✅ OpenAPI JSON successfully exported to: ${outputPath}`);
}

generateOpenApiDocument();