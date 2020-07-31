import {HttpErrors} from '@loopback/rest';
import * as validator from 'validator';
import {Product} from '../models';

export function validateProduct(data: Product): boolean {
  try {
    if (!data.name) {
      throw new HttpErrors.UnprocessableEntity('name is required');
    }
    if (validator.isEmpty(data.name)) {
      throw new HttpErrors.UnprocessableEntity('name is required');
    }
    // if (validator.isEmpty(data.sku)) {
    //   throw new HttpErrors.UnprocessableEntity('sku is required');
    // }
    // if (validator.isEmpty(data.categoryId)) {
    //   throw new HttpErrors.UnprocessableEntity('categoryId is required');
    // }
    // if (validator.isEmpty(data.imageUrl)) {
    //   throw new HttpErrors.UnprocessableEntity('imageUrl is required');
    // }
    if (validator.isEmpty(data.type)) {
      throw new HttpErrors.UnprocessableEntity('type is required');
    }
    if (data.type === 'product') {
      if (!Array.isArray(data.quantityDetails)) {
        throw new HttpErrors.UnprocessableEntity('quantityDetails is required');
      }
      if (!data.quantityDetails.length) {
        const dataType = JSON.stringify({
          quantity: 'string',
          purchaseDate: 'date',
          expirationDate: 'date',
          miniumThreshold: 'string',
        });
        throw new HttpErrors.UnprocessableEntity(
          `quantityDetails should be an array type of ${dataType}`,
        );
      }
      //   if (validator.isEmpty(data.costUnit)) {
      //     throw new HttpErrors.UnprocessableEntity('costUnit is required');
      //   }
      //   if (validator.isEmpty(data.totalCost)) {
      //     throw new HttpErrors.UnprocessableEntity('totalCost is required');
      //   }
      //   if (validator.isEmpty(data.priceUnit)) {
      //     throw new HttpErrors.UnprocessableEntity('priceUnit is required');
      //   }
      //   if (!Object.keys(data.vat).length) {
      //     throw new HttpErrors.UnprocessableEntity('vat is invalid');
      //   }
    }
    if (data.type === 'productVariant') {
      //   if (validator.isEmpty(data.productGroupName)) {
      //     throw new HttpErrors.UnprocessableEntity(
      //       'productGroupName is required',
      //     );
      //   }
      //   if (!Array.isArray(data.variantInformation)) {
      //     throw new HttpErrors.UnprocessableEntity(
      //       'variantInformation should be an array of objects',
      //     );
      //   }
      //   if (!data.variantInformation.length) {
      //     const typeData = {
      //       categoryId: 'string',
      //       categoryName: 'string',
      //       options: ['string'],
      //     };
      //     throw new HttpErrors.UnprocessableEntity(
      //       `invalid variantInformation should be of type ${JSON.stringify(
      //         typeData,
      //       )}`,
      //     );
      //   }
    }
    if (data.type === 'package') {
      if (!data.packageQuantity) {
        throw new HttpErrors.UnprocessableEntity(
          'package Quantity is required',
        );
      }
    }
    return true;
  } catch (err) {
    console.log('this is err', JSON.stringify(err));
    throw err;
  }
}
