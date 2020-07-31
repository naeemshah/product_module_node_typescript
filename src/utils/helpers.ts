import {Product} from '../models';

export function checkQuantityDetails(body: Product) {
  if (body.type === 'product') {
    const quantityDetails = body.quantityDetails.map(item => {
      const myItem = {...item} as {
        purchaseDate: Date | null;
        expirationDate: Date | null;
        quantity: number;
      };
      if (!myItem.purchaseDate) {
        delete myItem.purchaseDate;
      }
      if (!myItem.expirationDate) {
        delete myItem.expirationDate;
      }
      return {...myItem};
    });
    return quantityDetails;
  }
  return [];
}
