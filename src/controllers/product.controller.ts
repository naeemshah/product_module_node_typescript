import {api, Request, RestBindings, HttpErrors, Response} from '@loopback/rest';
import {def} from './product.controller.api';
import {repository, Filter} from '@loopback/repository';
import {Product, QuantityDetails} from '../models';
import {
  ProductRepository,
  VendorRepository,
  CategoryRepository,
  UserRespository,
} from '../repositories';
import {User} from '../services/jwt-strategy';
import {inject} from '@loopback/core';
import {validateProduct} from '../services/validations';
import Axios from 'axios';
import {vendorUrl, notificationUrl} from '../helper';
import {getStatus} from '../utils/statusCheck';
import {OrdersRepository} from '../repositories/orders';

@api(def)
export class ProductController {
  private userRepository: UserRespository;
  private vendorRepository: VendorRepository;
  private orderRepository: OrdersRepository;
  constructor(
    @repository('ProductRepository')
    private productRepository: ProductRepository,
    @repository('CategoryRepository')
    private categoryRepository: CategoryRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @inject(RestBindings.Http.RESPONSE)
    private resp: Response,
  ) {
    this.userRepository = new UserRespository(this.request);
    this.vendorRepository = new VendorRepository(this.request);
    this.orderRepository = new OrdersRepository(this.request);
  }

  finalQuantity(
    quantityForUpdating: {[key: string]: number},
    quantity: number,
  ): number {
    let finalQuantity = Object.values(quantityForUpdating).reduce(
      (acc, value) => {
        acc = acc + value;
        return acc;
      },
    );
    finalQuantity = quantity - finalQuantity;
    return finalQuantity;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProducts(filter?: any): Promise<any[]> {
    const user: User = await this.userRepository.find();
    if (typeof filter === 'string') {
      filter = JSON.parse(filter) as Filter;
    }
    filter = filter ? filter : ({where: {}} as Filter);
    if (user.parentId) {
      // if(filter.where && Object.keys(filter.where).length && filter.where.and){

      // }
      if (filter.where && Array.isArray(filter.where.and)) {
        filter.where = {
          ...filter.where,
          and: [
            ...filter.where.and,
            {userId: {like: user.parentId}},
            {createdBy: {like: user.id}},
          ],
        };
      } else {
        filter.where = {
          ...filter.where,
          and: [{userId: {like: user.parentId}}, {createdBy: {like: user.id}}],
        };
      }
    } else {
      filter.where = {...filter.where, userId: {like: user.id}};
    }

    let allProducts = await this.productRepository.find({
      ...filter,
      where: {...filter.where, isActive: true},
      include: [{relation: 'category'}, {relation: 'unit'}],
      order: ['createdAtDate DESC'],
    });
    allProducts = allProducts.map((item: Product) => {
      if (item.quantityDetails && item.quantityDetails.length) {
        const quantityDetailsLength = item.quantityDetails.length;
        item.quantity = this.getValueFromQuantityDetails(
          item.quantityDetails,
          'quantity',
        );
        item.costUnit =
          this.getValueFromQuantityDetails(item.quantityDetails, 'costUnit') /
          quantityDetailsLength;
        item.priceUnit =
          this.getValueFromQuantityDetails(item.quantityDetails, 'priceUnit') /
          quantityDetailsLength;
        if (item.vat)
          item.vat.vatRate =
            this.getValueFromQuantityDetails(item.quantityDetails, 'vat') /
            quantityDetailsLength;
      }
      item.status = getStatus(
        item.quantity,
        item.minimumThreshold,
        item.actionStatus,
      );
      item.quantity = item.quantityforUpdating
        ? this.finalQuantity(
            item.quantityforUpdating as {[key: string]: number},
            item.quantity,
          )
        : item.quantity;
      item.totalCost = item.quantity * item.costUnit;
      return {...item} as Product;
    });
    let products: object[];
    // products = await Promise.all(
    //   allProducts.map(async (item: Product) => {
    //     if (item.vendorId) {
    //       const res = await this.getSingleVendor(item.vendorId);
    //       // eslint-disable-next-line require-atomic-updates
    //       item.vendor = {...res.data};
    //       return {...item};
    //     } else {
    //       return {...item};
    //     }
    //   }),
    // );
    products = await Promise.all(
      allProducts.map(async (item: Product) => {
        if (item.vendorId) {
          const res = await this.getSingleVendor(item.vendorId);
          // eslint-disable-next-line require-atomic-updates
          item.vendor = {...res.data};
        }
        if (item.type === 'package') {
          let packageProducts = await this.productRepository.find({
            where: {
              id: {inq: item.packageItems},
              userId: {like: user.id},
              isActive: true,
            },
            include: [{relation: 'category'}, {relation: 'unit'}],
          });
          packageProducts = await Promise.all(
            packageProducts.map(async packageProduct => {
              if (packageProduct.type === 'productVariant') {
                const variantData = await this.productRepository.find({
                  where: {
                    id: {inq: packageProduct.variants},
                    userId: {like: user.id},
                    isActive: true,
                  },
                  include: [{relation: 'category'}, {relation: 'unit'}],
                });
                // eslint-disable-next-line require-atomic-updates
                packageProduct.variantData = variantData;
                return packageProduct;
              } else {
                return packageProduct;
              }
            }),
          );
          return {...item, packageProducts: packageProducts};
        } else if (item.type === 'productVariant' && item.variants) {
          let singleProductVariants = await this.productRepository.find({
            where: {id: {inq: item.variants}},
          });
          singleProductVariants = [
            ...singleProductVariants.map(variantItem => {
              variantItem.status = getStatus(
                variantItem.quantity,
                variantItem.minimumThreshold,
                variantItem.actionStatus,
              );
              const quantityDetailsLength = variantItem.quantityDetails
                ? variantItem.quantityDetails.length
                : 1;
              variantItem.quantity = this.getValueFromQuantityDetails(
                variantItem.quantityDetails,
                'quantity',
              );
              variantItem.costUnit =
                this.getValueFromQuantityDetails(
                  variantItem.quantityDetails,
                  'costUnit',
                ) / quantityDetailsLength;
              variantItem.priceUnit =
                this.getValueFromQuantityDetails(
                  variantItem.quantityDetails,
                  'priceUnit',
                ) / quantityDetailsLength;
              variantItem.totalCost =
                variantItem.costUnit * variantItem.quantity;
              return variantItem;
            }),
          ];
          return {...item, variantData: singleProductVariants};
        } else {
          return {...item};
        }
      }),
    );
    return products;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProduct(id: string): Promise<any> {
    const user: User = await this.userRepository.find();
    const filter = {where: {}};
    if (user.parentId) {
      // if(filter.where && Object.keys(filter.where).length && filter.where.and){

      // }
      filter.where = {
        ...filter.where,
        and: [{userId: {like: user.parentId}}, {createdBy: {like: user.id}}],
      };
    } else {
      filter.where = {...filter.where, userId: {like: user.id}};
    }
    const singleProduct = await this.productRepository.findById(id, {
      where: {...filter.where, isActive: true},
    });
    if (singleProduct.quantityDetails && singleProduct.quantityDetails.length) {
      const quantityDetailsLength = singleProduct.quantityDetails.length;
      singleProduct.quantity = this.getValueFromQuantityDetails(
        singleProduct.quantityDetails,
        'quantity',
      );
      singleProduct.costUnit =
        this.getValueFromQuantityDetails(
          singleProduct.quantityDetails,
          'costUnit',
        ) / quantityDetailsLength;
      singleProduct.priceUnit =
        this.getValueFromQuantityDetails(
          singleProduct.quantityDetails,
          'priceUnit',
        ) / quantityDetailsLength;
      if (singleProduct.vat)
        singleProduct.vat.vatRate =
          this.getValueFromQuantityDetails(
            singleProduct.quantityDetails,
            'vat',
          ) / quantityDetailsLength;
    }
    singleProduct.quantity = singleProduct.quantityforUpdating
      ? this.finalQuantity(
          singleProduct.quantityforUpdating as {[key: string]: number},
          singleProduct.quantity,
        )
      : singleProduct.quantity;
    singleProduct.status = getStatus(
      singleProduct.quantity,
      singleProduct.minimumThreshold,
      singleProduct.actionStatus,
    );
    singleProduct.totalCost = singleProduct.costUnit * singleProduct.quantity;
    if (singleProduct.vendorId) {
      const res = await this.getSingleVendor(singleProduct.vendorId);
      singleProduct.vendor = res.data;
    }

    // gettimng the variant products
    if (singleProduct.variants && singleProduct.type === 'productVariant') {
      let singleProductVariants = await this.productRepository.find({
        where: {id: {inq: singleProduct.variants}},
      });
      singleProductVariants = [
        ...singleProductVariants.map(variantItem => {
          const quantityDetailsLength = variantItem.quantityDetails
            ? variantItem.quantityDetails.length
            : 1;
          variantItem.quantity = this.getValueFromQuantityDetails(
            variantItem.quantityDetails,
            'quantity',
          );
          variantItem.costUnit =
            this.getValueFromQuantityDetails(
              variantItem.quantityDetails,
              'costUnit',
            ) / quantityDetailsLength;
          variantItem.priceUnit =
            this.getValueFromQuantityDetails(
              variantItem.quantityDetails,
              'priceUnit',
            ) / quantityDetailsLength;
          variantItem.status = getStatus(
            variantItem.quantity,
            variantItem.minimumThreshold,
            variantItem.actionStatus,
          );
          return variantItem;
        }),
      ];
      singleProduct.variantData = [...singleProductVariants];
    }

    if (singleProduct.type === 'package' && singleProduct.packageItems) {
      let packageProducts = await this.productRepository.find({
        where: {
          id: {inq: singleProduct.packageItems},
          userId: {like: user.id},
          isActive: true,
        },
        include: [{relation: 'category'}, {relation: 'unit'}],
      });
      packageProducts = await Promise.all(
        packageProducts.map(async item => {
          if (item.type === 'productVariant') {
            const variantData = await this.productRepository.find({
              where: {
                id: {inq: item.variants},
                userId: {like: user.id},
                isActive: true,
              },
              include: [{relation: 'category'}, {relation: 'unit'}],
            });
            // eslint-disable-next-line require-atomic-updates
            item.variantData = variantData;
            return item;
          } else {
            return item;
          }
        }),
      );
      if (packageProducts) {
        return {...singleProduct, packageProducts: packageProducts};
      }
      singleProduct.quantity =
        singleProduct.quantity || singleProduct.packageQuantity;
    }

    return singleProduct;
  }

  async createProduct(body: Product): Promise<Product> {
    const user: User = await this.userRepository.find();
    if (user.parentId) {
      body.createdBy = user.id;
      body.userId = user.parentId;
      if (user.parentId === user.id) {
        body.userId = user.id;
      }
    } else {
      body.userId = user.id;
    }
    const foundProductByName = await this.productRepository.findOne({
      where: {name: body.name, isActive: true, userId: user.id},
    });
    if (foundProductByName) {
      throw new HttpErrors.UnprocessableEntity(
        'product with this name already exists',
      );
    }
    validateProduct(body);
    let createdVariants: Product[] = [];
    if (!body.categoryId) {
      const foundCategory = await this.categoryRepository.findOne({
        where: {name: 'General'},
      });
      if (foundCategory) {
        // eslint-disable-next-line require-atomic-updates
        body.categoryId = foundCategory.id;
      }
    }
    if (body.type === 'productVariant' && body.variantData.length) {
      createdVariants = await Promise.all(
        body.variantData.map(async item => {
          const myItem = item as Product;
          delete myItem.id;
          const quantityDetailsLength = myItem.quantityDetails
            ? myItem.quantityDetails.length
            : 1;
          myItem.quantity = this.getValueFromQuantityDetails(
            myItem.quantityDetails,
            'quantity',
          );
          myItem.costUnit =
            this.getValueFromQuantityDetails(
              myItem.quantityDetails,
              'costUnit',
            ) / quantityDetailsLength;
          myItem.priceUnit =
            this.getValueFromQuantityDetails(
              myItem.quantityDetails,
              'priceUnit',
            ) / quantityDetailsLength;
          myItem.status = getStatus(
            myItem.quantity,
            myItem.minimumThreshold,
            myItem.actionStatus,
          );
          const createdProductVariant = await this.productRepository.create({
            ...myItem,
            type: 'variant',
            userId: user.id,
            userDevice: user.userDevice,
          });
          return createdProductVariant;
        }),
      );
    }
    if (body.type === 'product') {
      // eslint-disable-next-line require-atomic-updates
      const quantityDetailsLength = body.quantityDetails
        ? body.quantityDetails.length
        : 1;
      body.quantity = this.getValueFromQuantityDetails(
        body.quantityDetails,
        'quantity',
      );
      body.priceUnit =
        this.getValueFromQuantityDetails(body.quantityDetails, 'priceUnit') /
        quantityDetailsLength;
      body.costUnit =
        this.getValueFromQuantityDetails(body.quantityDetails, 'costUnit') /
        quantityDetailsLength;
    }
    if (body.type === 'package' && body.packageQuantity) {
      body.quantity = body.packageQuantity;
      if (!body.costUnit) body.costUnit = body.costAndPricing.costPackage;
      if (!body.priceUnit) body.priceUnit = body.costAndPricing.pricePackage;
    }
    // eslint-disable-next-line require-atomic-updates
    body.status = getStatus(
      body.quantity,
      body.minimumThreshold,
      body.actionStatus,
    );

    const createdProduct = await this.productRepository.create({
      ...body,
      variants: createdVariants.map(item => item.id),
      variantData: createdVariants,
    });
    if (createdProduct.vendorId) {
      const res = await this.getSingleVendor(body.vendorId);
      createdProduct.vendor = res.data;
    }
    return createdProduct;
  }

  async updateProduct(body: Product, id: string): Promise<{success: boolean}> {
    const user: User = await this.userRepository.find();
    const filter = {where: {}};
    if (user.parentId) {
      // if(filter.where && Object.keys(filter.where).length && filter.where.and){

      // }
      filter.where = {
        ...filter.where,
        and: [{userId: {like: user.parentId}}, {createdBy: {like: user.id}}],
      };
    } else {
      filter.where = {...filter.where, userId: {like: user.id}};
    }
    const foundProduct = await this.productRepository.findById(id, {
      where: {...filter.where, isActive: true},
    });

    if (!foundProduct) {
      throw new HttpErrors.NotFound('Product with this id not found');
    }
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    if (body.quantityDetails && body.quantityDetails.length) {
      const quantityDetailsLength = body.quantityDetails.length;
      body.quantity = this.getValueFromQuantityDetails(
        body.quantityDetails,
        'quantity',
      );
      body.costUnit =
        this.getValueFromQuantityDetails(body.quantityDetails, 'costUnit') /
        quantityDetailsLength;
      body.priceUnit =
        this.getValueFromQuantityDetails(body.quantityDetails, 'priceUnit') /
        quantityDetailsLength;
    }
    body.status = getStatus(
      body.quantity,
      body.minimumThreshold || foundProduct.minimumThreshold,
      body.actionStatus || foundProduct.actionStatus,
    );
    if (body.status === 'Low Stock' && !foundProduct.statusIgnored) {
      if (user.userDevice) {
        await this.createNotification({
          name: 'Stock Status',
          description: `The quantity of ${foundProduct.name} is low stock. Please update the quantity.`,
          sourceId: id,
          sourceType: foundProduct.type,

          type: 'product',
        });
      }
    }

    if (body.type === 'productVariant') {
      delete body.variantData;
      delete body.variants;
      // delete body.variantInformation
    }

    // if (body.type === 'productVariant') {
    //   // Here we need to check orders for the product
    //   const {productWithOrder, productWithoutOrder} = await this.checkOrder(
    //     body.variantData as Product[],
    //   );
    //   let variants: Product[] = [];
    //   if (productWithoutOrder.length) {
    //     const createdProducts: Product[] = await Promise.all(
    //       productWithoutOrder.map(
    //         async (item: Product): Promise<Product> => {
    //           const itemId = item.id;
    //           delete item.id;
    //           if (item.quantityDetails) {
    //             const quantityDetailsLength = item.quantityDetails.length;
    //             item.quantity = this.getValueFromQuantityDetails(
    //               item.quantityDetails,
    //               'quantity',
    //             );
    //             item.costUnit =
    //               this.getValueFromQuantityDetails(
    //                 item.quantityDetails,
    //                 'costUnit',
    //               ) / quantityDetailsLength;
    //             item.priceUnit =
    //               this.getValueFromQuantityDetails(
    //                 item.quantityDetails,
    //                 'priceUnit',
    //               ) / quantityDetailsLength;
    //           }
    //           item.status = getStatus(
    //             item.quantity,
    //             item.minimumThreshold,
    //             item.actionStatus,
    //           );
    //           if (item.status === 'Low Stock') {
    //             if (user.userDevice) {
    //               await this.createNotification({
    //                 name: 'Stock Status',
    //                 description: item.status,
    //                 sourceId: id,
    //                 sourceType: body.type,
    //                 type: 'product',
    //               });
    //             }
    //           }
    //           const createdProduct = await this.productRepository.create({
    //             ...item,
    //             type: 'variant',
    //             userId: user.id,
    //           });
    //           try {
    //             await this.productRepository.deleteById(itemId);
    //           } catch (err) {}
    //           return createdProduct;
    //         },
    //       ),
    //     );

    //     variants = [...createdProducts];
    //   }
    //   if (productWithOrder.length) {
    //     await Promise.all(
    //       productWithOrder.map(async (item: Product) => {
    //         await this.productRepository.updateById(item.id, item);
    //         return item.id;
    //       }),
    //     );
    //   }
    //   // variants = [...variants, ...productWithoutOrder];
    //   const finalVariants = variants.map(item => item.id);
    //   await this.productRepository.updateById(id, {
    //     ...body,
    //     variants: finalVariants,
    //     variantData: variants,
    //     updatedAt: Date.now(),
    //     lastUpdatedBy: {name: user.name, id: user.id},
    //   });
    //   // await this.productRepository.deleteAll({
    //   //   id: {inq: productWithoutOrder.map(item => item.id)},
    //   // });
    //   return Promise.resolve({success: true});
    // }
    if (body.type === 'package' && body.packageQuantity) {
      body.quantity = body.packageQuantity;
    }
    if (
      body.type === 'package' &&
      body.packageQuantity &&
      body.costAndPricing
    ) {
      body.quantity = body.packageQuantity;
      if (!body.costUnit) body.costUnit = body.costAndPricing.costPackage;
      if (!body.priceUnit) body.priceUnit = body.costAndPricing.pricePackage;
    }
    if (
      body.quantity &&
      body.quantity !== foundProduct.quantity &&
      foundProduct.preOrderQuantity &&
      Object.keys(foundProduct.preOrderQuantity).length
    ) {
      const newPreOrderQuantity = foundProduct.preOrderQuantity as {
        [key: string]: number;
      };
      const preOrderQuantity = {...foundProduct.preOrderQuantity} as {
        [key: string]: number;
      };
      for (const key in preOrderQuantity) {
        if (preOrderQuantity[key] <= body.quantity) {
          body.quantity = body.quantity - preOrderQuantity[key];
          delete newPreOrderQuantity[key];

          await this.orderRepository.updateOrder(key, {status: 'Active'});
        }
      }
      body.preOrderQuantity = newPreOrderQuantity;
    }

    await this.productRepository.updateById(id, {
      ...body,
      updatedAt: Date.now(),
      lastUpdatedBy: {name: user.name, id: user.id},
    });
    return Promise.resolve({success: true});
  }

  async checkOrder(
    variantData: Product[],
  ): Promise<{productWithOrder: Product[]; productWithoutOrder: Product[]}> {
    return {
      productWithOrder: variantData.filter(
        (item: Product): boolean => item.id === 'orderId',
      ),
      productWithoutOrder: variantData.filter(
        (item: Product): boolean => item.id !== 'orderId',
      ),
    };
  }

  async deleteProduct(id: string): Promise<{success: boolean}> {
    const user: User = await this.userRepository.find();
    const filter = {where: {}};
    if (user.parentId) {
      // if(filter.where && Object.keys(filter.where).length && filter.where.and){

      // }
      filter.where = {
        ...filter.where,
        and: [{userId: {like: user.parentId}}, {createdBy: {like: user.id}}],
      };
    } else {
      filter.where = {...filter.where, userId: {like: user.id}};
    }
    const foundCategory = await this.productRepository.findById(id, {
      where: {...filter.where},
    });

    if (!foundCategory) {
      throw new HttpErrors.NotFound('Product with this id not found');
    }

    await this.productRepository.updateById(id, {
      isActive: false,
      updatedAt: Date.now(),
    });
    return Promise.resolve({success: true});
  }

  async checkSku(body: Product): Promise<Product[]> {
    const user: User = await this.userRepository.find();
    const skus = await this.productRepository.find({
      where: {sku: {like: body.sku}, userId: {like: user.id}, isActive: true},
      order: ['createdAtDate DESC'],
      fields: {sku: true},
    });
    return skus;
  }

  async getSingleVendor(id: string): Promise<{data: object}> {
    try {
      const vendor: {data: object} = await Axios.get(
        `${vendorUrl}/v1/vendors/single/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: this.request.headers.authorization,
          },
        },
      );
      return vendor;
    } catch (err) {
      // console.log('this is err', err);
      return {data: {}};
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getVendor(id: string): Promise<any> {
    await this.vendorRepository.find(id);
    return {message: 'success'};
  }

  async createNotification(
    data: object,
    authorization?: object,
  ): Promise<{data: object}> {
    try {
      const notification: {data: object} = await Axios.post(
        `${notificationUrl}/v1/notifications/create`,
        data,
        {
          headers: {
            ...authorization,
            'Content-Type': 'application/json',
            authorization: this.request.headers.authorization,
          },
        },
      );
      return notification;
    } catch (err) {
      console.log('this is err', err);
      return {data: {}};
    }
  }

  async getPricesAndQuantity() {
    const user: User = await this.userRepository.find();
    const minPriceProduct = await this.productRepository.find({
      order: ['priceUnit ASC'],
      limit: 1,
      where: {
        isActive: true,
        userId: {like: user.id},
        or: [{type: 'product'}, {type: 'variant'}],
      },
    });
    const minPrice = minPriceProduct[0].priceUnit;
    const maxPriceProduct = await this.productRepository.find({
      order: ['priceUnit DESC'],
      limit: 1,
      where: {
        isActive: true,
        userId: {like: user.id},
        or: [{type: 'product'}, {type: 'variant'}],
      },
    });
    const maxPrice = maxPriceProduct[0].priceUnit;

    return {prices: [minPrice, maxPrice]};
  }

  async checkDateReplinishment() {
    try {
      const todayDate = new Date();
      const products = await this.productRepository.find({
        where: {expectedDateOfRelenishment: {lte: todayDate}},
      });

      for (const product of products) {
        await this.createNotification(
          {
            name: 'Expected Date of Replenishment',
            description: product.status,
            sourceId: product.id,
            sourceType: product.type,
            type: 'product',
            userId: product.userId,
            userDevice: product.userDevice,
          },
          {name: 'Notification', password: 'notificationPassword'},
        );
      }

      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async checkDateExpiry() {
    try {
      const todayDate = new Date();
      const products = await this.productRepository.find({
        where: {expirationDate: {lte: todayDate}, type: {nlike: 'product'}},
      });

      for (const product of products) {
        await this.createNotification(
          {
            name: 'Expected Date of Replenishment',
            description: product.status,
            sourceId: product.id,
            sourceType: product.type,
            type: 'product',
            userId: product.userId,
            userDevice: product.userDevice,
          },
          {name: 'Notification', password: 'notificationPassword'},
        );
      }

      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async aggregateProducts(filter: any) {
    const bills = Product as any;
    const ProductCollection = bills
      .getDataSource()
      .connector.collection(Product.modelName);
    if (!filter.aggregate) {
      throw new HttpErrors.UnprocessableEntity('agregate is requried');
    }
    const data = await ProductCollection.aggregate(filter.aggregate);
    return data;
  }

  getValueFromQuantityDetails(
    quantityDetails: QuantityDetails[],
    keyValue: string,
  ): number {
    if (!quantityDetails) return 0;
    return quantityDetails.reduce((acc: number, item: QuantityDetails) => {
      if (keyValue === 'quantity') acc += item.quantity;
      if (item.costUnit && keyValue === 'costUnit') acc += item.costUnit;
      if (item.priceUnit && keyValue === 'priceUnit') acc += item.priceUnit;
      if (item.vat && keyValue === 'vat') acc += item.vat.vatRate;
      return acc;
    }, 0);
  }
}
