// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const host = process.env.ORDERS_HOST || 'testing.egenienext.com:3015',
  protocol = process.env.ORDERS_PROTOCOL || 'http';

console.log('this is the host and protocol', host, protocol);

export const ordersDefinition = {
  swagger: '2.0',
  info: {
    title: 'product',
    version: '1.0.0',
  },
  host: host,
  basePath: '/',
  schemes: [protocol],
  paths: {
    '/v1/order/updateByOrderNo/{orderNo}': {
      post: {
        produces: ['*/*'],
        parameters: [
          {
            description: 'orderNo',
            format: 'JSON',
            in: 'path',
            name: 'orderNo',
            required: true,
            type: 'string',
          },
          {
            description: 'Body',
            format: 'JSON',
            in: 'body',
            name: 'body',
            required: true,
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                },
              },
            },
            // type: 'string',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Request was successful',
            schema: {
              type: 'string',
            },
          },
        },
        deprecated: false,
        operationId: 'updateOrder',
        summary:
          'Find all instances of the model matched by filter from the data source.',
      },
    },
  },
};
