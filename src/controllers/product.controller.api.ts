// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {productDefinition} from '../models';

export const def = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Product Microservice',
    contact: {},
    description: 'This is the api for the product service created by loopback.',
  },
  paths: {
    '/v1/products/all': {
      get: {
        'x-operation-name': 'getProducts',
        tags: ['Get all products'],
        summary: 'Finds all products',
        description: 'Finds all products',
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
            description: 'all products to be returned',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/products/aggregate': {
      get: {
        'x-operation-name': 'aggregateProducts',
        tags: ['Get all products'],
        summary: 'Finds all products',
        description: 'Finds all products',
        parameters: [
          {
            description:
              'Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})',
            format: 'JSON',
            in: 'query',
            name: 'filter',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          '200': {
            description: 'all products to be returned',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/products/{id}': {
      get: {
        'x-operation-name': 'getProduct',
        tags: ['Get single Product'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The product id.',
            required: true,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '200': {
            description: 'a product to be returned',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
        },
      },
    },
    '/v1/products/create': {
      post: {
        'x-operation-name': 'createProduct',
        tags: ['create Product'],
        responses: {
          '200': {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
        },
        parameters: [
          {
            description: 'Possible values for the type of product',
            // format: 'JSON',
            in: 'query',
            name: 'type',
            required: true,
            type: 'string',
            schema: {
              $ref: '#/components/schemas/Type',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Product',
              },
            },
          },
          description: 'The product instance.',
          required: true,
        },
      },
    },
    '/v1/products/update/{id}': {
      post: {
        'x-operation-name': 'updateProduct',
        tags: ['update Product'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The product id.',
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
                $ref: '#/components/schemas/Product',
              },
            },
          },
          description: 'The product instance.',
          required: true,
        },
      },
    },
    '/v1/products/delete/{id}': {
      get: {
        'x-operation-name': 'deleteProduct',
        tags: ['Get single Product'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The product id.',
            required: true,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '200': {
            description: 'a product to be deleted',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
        },
      },
    },
    '/v1/sku/check': {
      post: {
        'x-operation-name': 'checkSku',
        tags: ['check Sku'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  sku: {
                    type: 'string',
                  },
                },
              },
            },
          },
          description: 'The sku instance.',
          required: true,
        },
        responses: {
          '200': {
            description: 'all skus to be returned',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      sku: {type: 'string'},
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/vendors/{id}': {
      get: {
        'x-operation-name': 'getVendor',
        tags: ['Get single Vendor'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The product id.',
            required: false,
            schema: {
              type: 'string',
              format: 'JSON',
            },
          },
        ],
        responses: {
          '200': {
            description: 'a product to be returned',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
        },
      },
    },
    '/v1/products/maxMinPrices': {
      get: {
        'x-operation-name': 'getPricesAndQuantity',
        tags: ['Get max min values of prices and quantities'],
        responses: {
          '200': {
            description: 'a price array to be returned with min and max value',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    prices: {
                      type: 'array',
                      items: {
                        type: 'number',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    'v1/products/checkReplenished': {
      get: {
        'x-operation-name': 'checkDateReplinishment',
        tags: ['send notifications base on replenish date'],
        responses: {
          '200': {
            description: 'success message',
            content: {
              'application/json': {
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
    'v1/products/checkExpiration': {
      get: {
        'x-operation-name': 'checkDateExpiry',
        tags: ['send notifications base on replenish date'],
        responses: {
          '200': {
            description: 'success message',
            content: {
              'application/json': {
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
    // '/v1/images': {
    //   get: {
    //     'x-operation-name': 'getImage',
    //     tags: ['Get Image'],
    //     parameters: [
    //       {
    //         description: 'secret key for getting image',
    //         format: 'JSON',
    //         in: 'query',
    //         name: 'token',
    //         required: false,
    //         type: 'string',
    //       },
    //       {
    //         description: 'system generated name of image',
    //         format: 'JSON',
    //         in: 'query',
    //         name: 'name',
    //         required: false,
    //         type: 'string',
    //       },
    //     ],
    //     responses: {
    //       '200': {
    //         description: 'Image will be returned',
    //         content: {
    //           'image/png': {},
    //         },
    //       },
    //     },
    //   },
    // },
  },
  components: {
    schemas: {
      Product: productDefinition,
      Type: {
        type: 'string',
        enum: ['product', 'productVariant', 'service', 'package'],
      },
      Status: {
        type: 'string',
        enum: ['replenished', 'vendorContacted', 'discontinued'],
      },
    },
  },
};
