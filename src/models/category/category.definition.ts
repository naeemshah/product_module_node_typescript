export const categoryDefinition = {
  name: 'Category',
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
    variant: {type: 'boolean', default: false},
    createdBy: {type: 'string'},
  },
};
