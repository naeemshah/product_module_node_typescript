import {model, Entity, property, belongsTo} from '@loopback/repository';
import {productDefinition} from './product.definition';
import {Category, CategoryWithRelations} from './category/category.model';
import {Unit} from './unit/unit.model';

export class VariantInfromation {
  categoryId: string;
  categoryName: string;
  options: string[];
}

export class Vat {
  vatRate: number;
  vatIncluded: boolean;
}

export class CostAndPricing {
  costPackage: number;
  totalCost: number;
  pricePackage: number;
}

export class QuantityDetails {
  sequenceNo: string;
  quantity: number;
  purchaseDate: Date;
  expirationDate: Date;
  priceUnit: number;
  costUnit: number;
  vat: Vat;
}

export class ParentProduct {
  id: string;
  name: string;
}

@model(productDefinition)
export class Product extends Entity {
  constructor(data?: Partial<Product>) {
    super(data);
  }
  @property({
    type: 'string',
    generated: true,
    id: true,
  })
  id: string;
  @property({
    type: 'string',
    default: '',
  })
  name: string;
  @property({
    type: 'string',
    default: '',
  })
  modelNo: string;

  @property({
    type: 'string',
    required: false,
  })
  vendorId: string;
  @belongsTo(() => Category)
  categoryId: string;
  @property({
    type: 'array',
    itemType: 'object',
  })
  quantityDetails: QuantityDetails[];
  @property({
    type: 'string',
    // required: true,
  })
  sku: string;

  @property({
    type: 'string',
  })
  parentProduct: ParentProduct;

  @property({type: 'string', required: false})
  userId: string;
  @property({type: 'number'})
  costUnit: number;
  @property({type: 'number', default: ''})
  totalCost: number;
  @property({type: 'number'})
  priceUnit: number;
  @property({type: 'string', default: ''})
  currency: string;
  @property({type: 'object', default: {vatRate: '', vatIncluded: true}})
  vat: Vat;
  @property({
    type: 'string',
    default: '',
  })
  imageUrl: string;
  @property({
    type: 'string',
    default: 'product',
  })
  type: string;
  @property({
    type: 'string',
    default: '',
  })
  productGroupName: string;
  @property({
    type: 'array',
    itemType: 'object',
  })
  variantInformation: VariantInfromation[];
  @property({
    type: 'array',
    itemType: 'object',
  })
  variantData: object[];
  @property({
    type: 'number',
  })
  minimumThreshold: number;
  @property({
    type: 'array',
    itemType: 'string',
  })
  provider: string[];
  @property({
    type: 'array',
    itemType: 'string',
  })
  packageItems: string[];
  @property({
    type: 'object',
  })
  costAndPricing: CostAndPricing;
  @property({type: 'date', default: new Date()})
  createdAt: Date;
  @property({type: 'date', default: Date.now()})
  createdAtDate: Date;
  @property({type: 'date'})
  updatedAt: Date;
  @property({type: 'boolean', default: true})
  isActive: boolean;
  @belongsTo(() => Unit)
  unitId: string;
  @property({
    type: 'string',
  })
  status: string;
  @property({
    type: 'date',
  })
  lastBillDate: Date;
  @property({
    type: 'string',
  })
  lastBillNo: string;
  @property({
    type: 'object',
  })
  lastUpdatedBy: object;
  @property({
    type: 'number',
  })
  packageQuantity: number;

  @property({type: 'boolean'})
  deliveredReminder: boolean;
  @property({type: 'string'})
  expectedDateOfRelenishment: Date;
  @property()
  orderDate: Date;
  @property({
    type: 'object',
  })
  vendor: object;
  @property({
    type: 'array',
    itemType: 'object',
  })
  packageProducts: object[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  variants: string[];
  @property({
    type: 'date',
  })
  purchaseDate: Date;
  @property({
    type: 'date',
  })
  expirationDate: Date;
  @property({
    type: 'number',
  })
  quantity: number;
  @property({
    type: 'boolean',
  })
  quantityChanged: boolean;
  @property({
    type: 'object',
    jsonSchema: {
      type: 'object',
      properties: {
        quantity: {type: 'string'},
        priceUnit: {type: 'string'},
      },
    },
  })
  billQuantity: object;
  @property({
    type: 'string',
  })
  actionStatus: string;
  @property({
    type: 'boolean',
  })
  statusIgnored: boolean;
  @property({
    type: 'object',
  })
  quantityforUpdating: object;

  @property({
    type: 'object',
  })
  preOrderQuantity: object;

  @property({
    type: 'string',
  })
  createdBy: string;

  @property({
    type: 'array',
    itemType: 'object',
    properties: {
      deviceName: {type: 'string'},
      deviceId: {type: 'string'},
      browser: {type: 'string'},
      token: {type: 'string'},
    },
  })
  userDevice: object[];
}

export interface ProductRelations {
  // describe navigational properties here
  category?: CategoryWithRelations;
}

export type ProductWithRelations = Product & ProductRelations;
