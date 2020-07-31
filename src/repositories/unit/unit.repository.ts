import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Unit, Product} from '../../models';
import {MongoDataSource} from '../../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from '../product.repository';

export class UnitRepository extends DefaultCrudRepository<Unit, string> {
  private readonly products: HasManyRepositoryFactory<
    Product,
    typeof Unit.prototype.id
  >;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('ProductRepository')
    productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Unit, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
    );

    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
