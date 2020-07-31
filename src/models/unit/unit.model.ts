import {model, Entity, property, hasMany} from '@loopback/repository';
import {unitDefinition} from './unit.definition';
import {Product} from '../product.model';

@model(unitDefinition)
export class Unit extends Entity {
  constructor(data?: Partial<Unit>) {
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
    required: false,
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
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  variant: boolean;

  @property({
    type: 'string',
  })
  createdBy: string;

  @hasMany(() => Product)
  products: Product[];
}

export interface UnitRelations {
  // describe navigational properties here
}

export type UnitWithRelations = Unit & UnitRelations;
