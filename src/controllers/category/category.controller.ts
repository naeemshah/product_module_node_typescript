import {
  api,
  Request,
  RestBindings,
  HttpErrors,
  get,
  param,
} from '@loopback/rest';
import {def} from './category.controller.api';
import {repository, Filter} from '@loopback/repository';
import {Category} from '../../models';
import {CategoryRepository, UserRespository} from '../../repositories';
import {User} from './../../services/jwt-strategy';
import {inject} from '@loopback/core';

@api(def)
export class CategoryController {
  private userRepository: UserRespository;
  constructor(
    @repository('CategoryRepository')
    public categoryRepository: CategoryRepository,
    @inject(RestBindings.Http.REQUEST)
    public request: Request,
  ) {
    this.userRepository = new UserRespository(this.request);
  }

  async getCategories(filter?: Filter | string): Promise<Category[]> {
    console.log('this si filter', filter);
    const user: User = await this.userRepository.find();

    if (typeof filter === 'string') {
      filter = JSON.parse(filter) as Filter;
    }
    filter = filter ? filter : ({where: {}} as Filter);

    if (user.parentId) {
      // if(filter.where && Object.keys(filter.where).length && filter.where.and){

      // }
      // eslint-disable-next-line require-atomic-updates
      filter.where = {
        ...filter.where,
        and: [{userId: {like: user.parentId}}, {createdBy: {like: user.id}}],
      };
    } else {
      // eslint-disable-next-line require-atomic-updates
      filter.where = {...filter.where, userId: {like: user.id}};
    }

    const categories = await this.categoryRepository.find({
      ...filter,
      where: {
        ...filter.where,
      },
      order: ['createdAtDate DESC'],
    });
    if (!categories.length) {
      await this.createGeneralCategories(user.id);
      return this.categoryRepository.find({
        ...filter,
        where: {
          ...filter.where,
        },
      });
    }
    return categories;
  }

  async getCategory(id: string): Promise<Category> {
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
    return this.categoryRepository.findById(id, {
      where: {...filter.where},
    });
  }

  async createCategory(body: Category): Promise<Category> {
    const user: User = await this.userRepository.find();
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    if (user.parentId) {
      body.createdBy = user.id;
      body.userId = user.parentId;
      if (user.parentId === user.id) {
        body.userId = user.id;
      }
    } else {
      body.userId = user.id;
    }
    return this.categoryRepository.create(body);
  }

  async updateCategory(
    body: Category,
    id: string,
  ): Promise<{success: boolean}> {
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
    const foundCategory = await this.categoryRepository.findById(id, filter);
    if (!foundCategory) {
      throw new HttpErrors.NotFound('Category with this id not found');
    }
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    await this.categoryRepository.updateById(id, {
      ...body,
      updatedAt: Date.now(),
    });
    return Promise.resolve({success: true});
  }

  async deleteCategory(id: string): Promise<{success: boolean}> {
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
    const foundCategory = await this.categoryRepository.findById(id, filter);
    if (!foundCategory) {
      throw new HttpErrors.NotFound('Category with this id not found');
    }
    await this.categoryRepository.deleteById(id);
    return {success: true};
  }
  @get('/v1/category/createGeneral/{id}')
  async createGeneralCategories(@param.path.string('id') id: string) {
    const generalCat = [
      {name: 'Electronic Devices', variant: false},
      {name: 'Electronic Accessories', variant: false},
      {name: 'TV & Home Appliances', variant: false},
      {name: 'Health & Beauty', variant: false},
      {name: 'Babies & Toys', variant: false},
      {name: 'Groceries & Pets', variant: false},
      {name: 'Home & Lifestyle', variant: false},
      {name: "Women's Fashion", variant: false},
      {name: "Men's Fashion", variant: false},
      {name: 'Watches', variant: false},
      {name: 'Bags & Jewelry', variant: false},
      {name: 'Sports & Outdoor', variant: false},
      {name: 'Automotive & Motorbike', variant: false},
      {name: 'Books', variant: false},
      {name: 'Movies & Music', variant: false},
      {name: 'Electronics', variant: false},
      {name: 'Collectibles & Art', variant: false},
      {name: 'Home & Garden', variant: false},
      {name: 'Sporting Goods', variant: false},
      {name: 'Toys & Hobbies', variant: false},
      {name: 'Business & Industrial', variant: false},
      {name: 'Health & Beauty', variant: false},
      {name: 'Consumer Electronics', variant: false},
      {name: 'Phones & Accessories', variant: false},
      {name: 'Computer & Office', variant: false},
      {name: 'Tools & Home Improvement', variant: false},
      {name: 'Home Appliances', variant: false},
      {name: 'Sports & Entertainment', variant: false},
      {name: 'Motorcycles', variant: false},
      {name: 'Fashion Accessories', variant: false},
      {name: 'Baby & Kids', variant: false},
      {name: 'Jewelry & Watches', variant: false},
      {name: "Men's Clothing", variant: false},
      {name: 'Raw Material', variant: false},
      {name: 'Shoes', variant: false},
      {name: 'Wood', variant: false},
      {name: 'Glass', variant: false},
      {name: 'Metal', variant: false},
      {name: 'Aluminum', variant: false},
      {name: 'Chemicals', variant: false},
      {name: 'Food Factory', variant: false},
      {name: 'General', variant: false},
      {name: 'Size', variant: true},
      {name: 'Color', variant: true},
      {name: 'Weight', variant: true},
      {name: 'Volume', variant: true},
    ];
    await Promise.all(
      generalCat.map(async item => {
        const data = await this.categoryRepository.create({
          name: item.name,
          userId: id,
          variant: item.variant,
        });
        return data;
      }),
    );
    return {success: true};
  }
}
