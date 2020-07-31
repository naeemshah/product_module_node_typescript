// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {unitDefinition} from '../../models';

export const def = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Unit Services',
    contact: {},
    description:
      'This is the api for the category service created by loopback.',
  },
  paths: {
    '/v1/unit/all': {
      get: {
        'x-operation-name': 'getUnits',
        tags: ['Get all units'],
        summary: 'Finds all units',
        description: 'Finds all units',
        parameters: [
          {
            description:
              'Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})',
            format: 'JSON',
            in: 'query',
            name: 'filter',
            required: false,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: 'all units to be returned',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Unit',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/unit/single/{id}': {
      get: {
        'x-operation-name': 'getUnit',
        tags: ['Get single unit'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The unit id.',
            required: true,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '200': {
            description: 'a unit to be returned',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Unit',
                },
              },
            },
          },
        },
      },
    },
    '/v1/unit/create': {
      post: {
        'x-operation-name': 'createUnit',
        tags: ['create unit'],
        responses: {
          '200': {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Unit',
                },
              },
            },
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Unit',
              },
            },
          },
          description: 'The unit instance.',
          required: true,
        },
      },
    },
    '/v1/unit/update/{id}': {
      post: {
        'x-operation-name': 'updateUnit',
        tags: ['update Unit'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The unit id.',
            required: true,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '204': {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {type: 'boolean'},
                  },
                },
              },
            },
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Unit',
              },
            },
          },
          description: 'The unit instance.',
          required: true,
        },
      },
    },
    '/v1/unit/delete/{id}': {
      post: {
        'x-operation-name': 'deleteUnit',
        tags: ['delete Unit'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The delete id.',
            required: true,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '204': {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {type: 'boolean'},
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Unit: unitDefinition,
    },
  },
};
