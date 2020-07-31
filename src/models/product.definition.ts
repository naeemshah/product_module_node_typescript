export const productDefinition = {
  name: 'Product',
  settings: {
    strictObjectIDCoercion: true,
  },
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
    modelNo: {
      type: 'string',
      default: '',
    },
    vendorId: {
      type: 'string',
    },
    categoryId: {
      type: 'string',
    },
    quantityDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sequenceNo: {type: 'string'},
          quantity: {type: 'number'},
          purchaseDate: {type: 'string', nullable: true, format: 'date'},
          expirationDate: {type: 'string', nullable: true, format: 'date'},
          priceUnit: {type: 'number'},
          costUnit: {type: 'number'},
          vat: {
            type: 'object',
            properties: {
              vatRate: {type: 'number'},
              vatIncluded: {type: 'boolean'},
            },
          },
        },
      },
    },
    sku: {type: 'string'},
    userId: {type: 'string'},
    costUnit: {type: 'number'},
    totalCost: {type: 'number'},
    priceUnit: {type: 'number'},
    currency: {type: 'string'},
    vat: {
      type: 'object',
      properties: {
        vatRate: {type: 'number'},
        vatIncluded: {type: 'boolean'},
      },
    },
    imageUrl: {type: 'string'},
    type: {type: 'string', default: 'product'},
    productGroupName: {type: 'string'},
    variantInformation: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
          },
          categoryName: {
            type: 'string',
          },
          options: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },

    variantData: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    variants: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    minimumThreshold: {type: 'number'},
    numberOfUnits: {type: 'string'},
    provider: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    packageItems: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    costAndPricing: {
      type: 'object',
      properties: {
        costPackage: {type: 'number'},
        totalCost: {type: 'number'},
        pricePackage: {type: 'number'},
      },
    },
    packageQuantity: {type: 'number'},
    unitId: {type: 'string'},
    status: {type: 'string'},
    lastBillDate: {type: 'string', format: 'date'},
    lastBillNo: {type: 'string'},
    lastUpdatedBy: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        name: {type: 'string'},
      },
    },
    deliveredReminder: {type: 'boolean'},
    expectedDateOfReplenishment: {type: 'string', format: 'date'},
    orderDate: {type: 'string', format: 'date'},
    vendor: {type: 'object', properties: {data: {type: 'object'}}},
    packageProducts: {type: 'array', items: {type: 'object'}},
    purchaseDate: {type: 'string', format: 'date'},
    expirationDate: {type: 'string', format: 'date'},
    quantity: {type: 'number'},
    quantityChanged: {type: 'boolean'},
    actionStatus: {type: 'string'},
    statusIgnored: {type: 'boolean'},
    quantityforUpdating: {
      type: 'object',
      properties: {
        quantity: {type: 'number'},
      },
    },
    preOrderQuantity: {
      type: 'object',
    },
    billQuantity: {
      type: 'object',
    },
    userDevice: {type: 'object'},
    createdBy: {type: 'string'},
    createdAt: {type: 'string', format: 'date'},
    createdAtDate: {type: 'string', format: 'date'},
    updatedAt: {type: 'string', format: 'date'},
  },
  // relations: {
  //   categoryId: {
  //     type: 'belongsTo',
  //     model: 'Category',
  //     foreignKey: 'categoryId',
  //   },
  // },
};
