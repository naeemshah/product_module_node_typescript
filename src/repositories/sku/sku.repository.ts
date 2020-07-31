import {DefaultCrudRepository} from '@loopback/repository';
import {Sku} from '../../models';
import {MongoDataSource} from '../../datasources';
import {inject} from '@loopback/core';

export class SkuRepository extends DefaultCrudRepository<Sku, string> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Sku, dataSource);
  }
}
