export const skuDefinition = {
  name: 'Sku',
  properties: {
    id: {
      type: 'string',
      generated: true,
      id: true,
    },
    name: {
      type: 'string',
      default: '',
    },
    userId: {type: 'string'},
    createdAt: {type: 'string', format: 'date'},
    createdAtDate: {type: 'string', format: 'date'},
    updatedAt: {type: 'string', format: 'date'},
    createdBy: {type: 'string'},
  },
  variant: {type: 'boolean', default: false},
};
