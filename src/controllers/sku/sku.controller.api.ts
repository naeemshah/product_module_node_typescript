// // Copyright IBM Corp. 2018. All Rights Reserved.
// // Node module: loopback4-example-microservices
// // This file is licensed under the MIT License.
// // License text available at https://opensource.org/licenses/MIT

// import {skuDefinition} from '../../models';

// export const def = {
//   openapi: '3.0.0',
//   info: {
//     version: '1.0.0',
//     title: 'Sku Services',
//     contact: {},
//     description: 'This is the api for the sku service created by loopback.',
//   },
//   paths: {
//     '/v1/sku/all': {
//       get: {
//         'x-operation-name': 'getAllSku',
//         tags: ['Get all skus'],
//         summary: 'Finds all skus',
//         description: 'Finds all skus',
//         parameters: [
//           {
//             name: 'filter',
//             in: 'query',
//             description:
//               'The criteria used to narrow down the number of sku returned.',
//             // required: false,
//             schema: {
//               type: 'object',
//             },
//           },
//         ],
//         responses: {
//           '200': {
//             description: 'all skus to be returned',
//             content: {
//               'application/json': {
//                 schema: {
//                   type: 'array',
//                   items: {
//                     $ref: '#/components/schemas/Sku',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     '/v1/sku/findOrCreateByName': {
//       post: {
//         'x-operation-name': 'getSkuByName',
//         tags: ['Get sku by name'],
//         requestBody: {
//           content: {
//             'application/json': {
//               schema: {
//                 properties: {
//                   name: {
//                     type: 'string',
//                   },
//                   variant: {
//                     type: 'boolean',
//                   },
//                 },
//               },
//             },
//           },
//           description: 'The sku instance.',
//           required: true,
//         },
//       },
//     },
//     '/v1/sku/single/{id}': {
//       get: {
//         'x-operation-name': 'getSku',
//         tags: ['Get single sku'],
//         parameters: [
//           {
//             name: 'id',
//             in: 'path',
//             description: 'The sku id.',
//             required: true,
//             schema: {
//               type: 'string',
//               format: 'JSON',
//             },
//           },
//         ],
//         responses: {
//           '200': {
//             description: 'a sku to be returned',
//             content: {
//               'application/json': {
//                 schema: {
//                   $ref: '#/components/schemas/Sku',
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     '/v1/sku/create': {
//       post: {
//         'x-operation-name': 'createSku',
//         tags: ['create Sku'],
//         responses: {
//           '200': {
//             description: 'ok',
//             content: {
//               'application/json': {
//                 schema: {
//                   $ref: '#/components/schemas/Sku',
//                 },
//               },
//             },
//           },
//         },
//         requestBody: {
//           content: {
//             'application/json': {
//               schema: {
//                 $ref: '#/components/schemas/Sku',
//               },
//             },
//           },
//           description: 'The sku instance.',
//           required: true,
//         },
//       },
//     },
//     '/v1/sku/update/{id}': {
//       post: {
//         'x-operation-name': 'updateSku',
//         tags: ['update Sku'],
//         parameters: [
//           {
//             name: 'id',
//             in: 'path',
//             description: 'The sku id.',
//             required: true,
//             schema: {
//               type: 'string',
//               format: 'JSON',
//             },
//           },
//         ],
//         responses: {
//           '204': {
//             description: 'ok',
//             content: {
//               'application/json': {
//                 schema: {
//                   type: 'object',
//                   properties: {
//                     success: {type: 'boolean'},
//                   },
//                 },
//               },
//             },
//           },
//         },
//         requestBody: {
//           content: {
//             'application/json': {
//               schema: {
//                 $ref: '#/components/schemas/Sku',
//               },
//             },
//           },
//           description: 'The sku instance.',
//           required: true,
//         },
//       },
//     },
//     '/v1/sku/delete/{id}': {
//       post: {
//         'x-operation-name': 'deleteSku',
//         tags: ['delete Sku'],
//         parameters: [
//           {
//             name: 'id',
//             in: 'path',
//             description: 'The delete id.',
//             required: true,
//             schema: {
//               type: 'string',
//               format: 'JSON',
//             },
//           },
//         ],
//         responses: {
//           '204': {
//             description: 'ok',
//             content: {
//               'application/json': {
//                 schema: {
//                   type: 'object',
//                   properties: {
//                     success: {type: 'boolean'},
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     '/v1/sku/check': {
//       post: {
//         'x-operation-name': 'checkSku',
//         tags: ['check Sku'],
//         requestBody: {
//           content: {
//             'application/json': {
//               schema: {
//                 properties: {
//                   name: {
//                     type: 'string',
//                   },
//                 },
//               },
//             },
//           },
//           description: 'The sku instance.',
//           required: true,
//         },
//         responses: {
//           '200': {
//             description: 'all skus to be returned',
//             content: {
//               'application/json': {
//                 schema: {
//                   type: 'array',
//                   items: {
//                     $ref: '#/components/schemas/Sku',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   components: {
//     schemas: {
//       Sku: skuDefinition,
//     },
//   },
// };
