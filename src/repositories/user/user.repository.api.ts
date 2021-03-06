// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const host = process.env.AUTH_HOST || 'testing.egenienext.com:3003',
  protocol = process.env.AUTH_PROTOCOL || 'http';

export const userDefinition = {
  swagger: '2.0',
  info: {
    title: 'user',
    version: '1.0.0',
  },
  host: host,
  basePath: '/',
  schemes: [protocol],
  paths: {
    '/v1/users/checkAuth': {
      get: {
        produces: ['*/*'],
        security: [
          {
            // eslint-disable-next-line @typescript-eslint/camelcase
            api_key: [],
          },
        ],
        parameters: [],
        responses: {
          '200': {
            description: 'Request was successful',
            schema: {
              type: 'string',
            },
          },
        },
        deprecated: false,
        operationId: 'checkAuth',
        summary:
          'Find all instances of the model matched by filter from the data source.',
      },
    },
  },
  securityDefinitions: {
    // eslint-disable-next-line @typescript-eslint/camelcase
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header',
    },
  },
};
