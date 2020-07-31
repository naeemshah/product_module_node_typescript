// import {api, Request, RestBindings, HttpErrors} from '@loopback/rest';
// import {def} from './sku.controller.api';
// import {repository, Filter} from '@loopback/repository';
// import {Sku} from '../../models';
// import {SkuRepository} from '../../repositories';
// import {JwtService, User} from './../../services/jwt-strategy';
// import {inject} from '@loopback/core';

// @api(def)
// export class SkuController {
//   constructor(
//     @repository('SkuRepository')
//     public skuRepository: SkuRepository,
//     @inject(RestBindings.Http.REQUEST)
//     public request: Request,
//   ) {}
//   jwtService: JwtService = new JwtService();

//   async getAllSku(filter?: Filter | string): Promise<Sku[]> {
//     const user: User = await this.jwtService.authenticate(this.request);

//     if (typeof filter === 'string') {
//       filter = JSON.parse(filter) as Filter;
//     }
//     filter = filter ? filter : {where: {}};
//     return this.skuRepository.find({
//       ...filter,
//       where: {...filter.where, userId: {like: user.id}},
//     });
//   }
//   async getSkuByName(body: {
//     name: string;
//     variant: boolean;
//   }): Promise<{id: string; name: string; created: boolean}> {
//     const user: User = await this.jwtService.authenticate(this.request);
//     const skus = await this.skuRepository.find({
//       where: {name: {like: body.name}, userId: {like: user.id}},
//       order: ['createdAtDate DESC'],
//       limit: 1,
//     });
//     if (skus.length) {
//       let latestSku: Sku | string[] = skus[0];
//       latestSku = latestSku.name.split('-');
//       const newSkuPartOne = latestSku[0];
//       let newSkuPartTwo: string | number = latestSku[1];
//       let newSkuPartThree: string | number = latestSku[2];

//       let ans2 = newSkuPartTwo;
//       let ans3 = newSkuPartThree;
//       if (body.variant) {
//         newSkuPartThree = Number(newSkuPartThree) + 1;
//         const str3 = '' + newSkuPartThree;
//         const pad3 = '0000';
//         ans3 = pad3.substring(0, pad3.length - str3.length) + str3;
//       } else {
//         newSkuPartTwo = Number(newSkuPartTwo) + 1;
//         const str2 = '' + newSkuPartTwo;
//         const pad2 = '0000';
//         ans2 = pad2.substring(0, pad2.length - str2.length) + str2;
//       }
//       const finalSku = `${newSkuPartOne}-${ans2}-${ans3}`;
//       const createdSku = await this.skuRepository.create({
//         name: finalSku,
//         userId: user.id,
//       });
//       return {id: createdSku.id, name: finalSku, created: false};
//     } else {
//       const newName = `${body.name}-00000-000`;
//       const createdSku: Sku = await this.skuRepository.create({
//         name: newName,
//         userId: user.id,
//       });
//       return {id: createdSku.id, name: createdSku.name, created: true};
//     }
//   }

//   async checkSku(body: Sku): Promise<Sku[]> {
//     const user: User = await this.jwtService.authenticate(this.request);
//     const skus = await this.skuRepository.find({
//       where: {name: {like: body.name}, userId: {like: user.id}},
//       order: ['createdAtDate DESC'],
//       limit: 1,
//     });
//     return skus;
//   }

//   async getSku(id: string): Promise<Sku> {
//     const user: User = await this.jwtService.authenticate(this.request);
//     return this.skuRepository.findById(id, {
//       where: {userId: {like: user.id}},
//     });
//   }

//   async createSku(body: Sku): Promise<Sku> {
//     const user: User = await this.jwtService.authenticate(this.request);
//     if (typeof body === 'string') {
//       body = JSON.parse(body);
//     }
//     body.userId = user.id;
//     return this.skuRepository.create(body);
//   }

//   async updateSku(body: Sku, id: string): Promise<{success: boolean}> {
//     const user: User = await this.jwtService.authenticate(this.request);
//     const foundSku = await this.skuRepository.findById(id, {
//       where: {userId: {like: user.id}},
//     });
//     if (!foundSku) {
//       throw new HttpErrors.NotFound('Sku with this id not found');
//     }

//     if (typeof body === 'string') {
//       body = JSON.parse(body);
//     }
//     await this.skuRepository.updateById(id, body);
//     return Promise.resolve({success: true});
//   }

//   async deleteSku(id: string): Promise<{success: boolean}> {
//     const user: User = await this.jwtService.authenticate(this.request);
//     const foundSku = await this.skuRepository.findById(id, {
//       where: {userId: {like: user.id}},
//     });
//     if (!foundSku) {
//       throw new HttpErrors.NotFound('Sku with this id not found');
//     }
//     await this.skuRepository.deleteById(id);
//     return {success: true};
//   }
// }
