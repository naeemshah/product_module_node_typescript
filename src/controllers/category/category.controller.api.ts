// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {categoryDefinition} from '../../models';

export const def = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Category Services',
    contact: {},
    description:
      'This is the api for the category service created by loopback.',
  },
  paths: {
    '/v1/category/all': {
      get: {
        'x-operation-name': 'getCategories',
        tags: ['Get all categories'],
        summary: 'Finds all categories',
        description: 'Finds all categories',
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
            description: 'all categories to be returned',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Category',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/category/single/{id}': {
      get: {
        'x-operation-name': 'getCategory',
        tags: ['Get single category'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The category id.',
            required: true,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '200': {
            description: 'a category to be returned',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Category',
                },
              },
            },
          },
        },
      },
    },

    '/v1/category/create': {
      post: {
        'x-operation-name': 'createCategory',
        tags: ['create Category'],
        responses: {
          '200': {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Category',
                },
              },
            },
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Category',
              },
            },
          },
          description: 'The category instance.',
          required: true,
        },
      },
    },
    '/v1/category/createGeneral/{id}': {
      get: {
        'x-operation-name': 'createGeneralCategories',
        tags: ['create general category'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The user id.',
            required: true,
            schema: {
              type: 'string',
              // format: 'JSON',
            },
          },
        ],
        responses: {
          '200': {
            description: 'success response will be returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/category/update/{id}': {
      post: {
        'x-operation-name': 'updateCategory',
        tags: ['update Category'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The category id.',
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
                $ref: '#/components/schemas/Category',
              },
            },
          },
          description: 'The category instance.',
          required: true,
        },
      },
    },
    '/v1/category/delete/{id}': {
      post: {
        'x-operation-name': 'deleteCategory',
        tags: ['delete Category'],
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
      Category: categoryDefinition,
    },
  },
};
