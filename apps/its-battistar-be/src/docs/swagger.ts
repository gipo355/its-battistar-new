import swaggerJSDocument = require('swagger-jsdoc');

import { API_VERSION } from '../config';
import path = require('path');

const appVersion = API_VERSION;

const options: swaggerJSDocument.Options = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: `https://localhost/api/${appVersion}`,
        description: 'development server',
      },
    ],
    info: {
      title: 'Natours API docs',
      version: appVersion,
      description: 'This is a simple API',
      contact: {
        email: 'you@your-company.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      termsOfService: '/terms-of-use',
    },
    tags: [{ name: 'api', description: 'api desc' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
          },
        },
      },
    },
    // security: [
    //     {
    //         bearerAuth: [],
    //     },
    // ],
  },
  apis: [path.resolve(__dirname, './main.js')],
};

export const swaggerSpec = swaggerJSDocument(options);
