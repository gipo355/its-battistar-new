import swaggerJSDocument = require('swagger-jsdoc');

import { APP_CONFIG as c } from '../app.config';
import path = require('path');

const appVersion = c.API_VERSION;

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
    tags: [
      // manual tags
      //   {
      //   name: 'api',
      //   description: 'api desc'
      // }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'id univoco generato lato server',
            },
            title: {
              type: 'string',
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'data entro la quale completare il task',
            },
            completed: {
              type: 'boolean',
            },
            expired: {
              type: 'boolean',
              description:
                'true se il todo ha una dueDate, la data è passata e il task non è completato',
            },
          },
        },
        Response: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
              example: true,
            },
            statusCode: {
              type: 'number',
              example: 200,
            },
            message: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
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
