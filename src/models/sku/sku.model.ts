import {model, Entity, property} from '@loopback/repository';
import {skuDefinition} from './sku.definition';

@model(skuDefinition)
export class Sku extends Entity {
  constructor(data?: Partial<Sku>) {
    super(data);
  }
  @property({
    id: true,
    generated: true,
    type: 'string',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    default: new Date(),
  })
  createdAt: Date;
  @property({
    default: Date.now(),
  })
  createdAtDate: Date;

  @property({
    type: 'date',
  })
  updatedAt: Date;

  @property({
    type: 'string',
  })
  createdBy: string;
}

export interface SkuRelations {
  // describe navigational properties here
}

export type SkuWithRelations = Sku & SkuRelations;
