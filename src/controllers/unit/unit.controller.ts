import {api, Request, RestBindings, HttpErrors} from '@loopback/rest';
import {def} from './unit.controller.api';
import {repository, Filter} from '@loopback/repository';
import {Unit} from '../../models';
import {UnitRepository, UserRespository} from '../../repositories';
import {User} from '../../services/jwt-strategy';
import {inject} from '@loopback/core';

@api(def)
export class UnitController {
  private userRepository: UserRespository;
  constructor(
    @repository('UnitRepository')
    public unitRepository: UnitRepository,
    @inject(RestBindings.Http.REQUEST)
    public request: Request,
  ) {
    this.userRepository = new UserRespository(this.request);
  }

  async getUnits(filter?: Filter | string): Promise<Unit[]> {
    const user: User = await this.userRepository.find();

    if (typeof filter === 'string') {
      filter = JSON.parse(filter) as Filter;
    }
    filter = filter ? filter : {where: {}};
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
    return this.unitRepository.find({
      ...filter,
      where: {...filter.where},
      order: ['createdAtDate DESC'],
    });
  }

  async getUnit(id: string): Promise<Unit> {
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
    return this.unitRepository.findById(id, {
      where: {...filter.where},
    });
  }

  async createUnit(body: Unit): Promise<Unit> {
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
    return this.unitRepository.create(body);
  }

  async updateUnit(id: string, body: Unit): Promise<{success: boolean}> {
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
    const foundUnit = await this.unitRepository.findById(id, filter);
    if (!foundUnit) {
      throw new HttpErrors.NotFound('Unit with this id not found');
    }
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    await this.unitRepository.updateById(id, body);
    return Promise.resolve({success: true});
  }

  async deleteUnit(id: string): Promise<{success: boolean}> {
    const user: User = await this.userRepository.find();
    const foundUnit = await this.unitRepository.findById(id, {
      where: {userId: {like: user.id}},
    });
    if (!foundUnit) {
      throw new HttpErrors.NotFound('Unit with this id not found');
    }
    await this.unitRepository.deleteById(id);
    return {success: true};
  }
}
