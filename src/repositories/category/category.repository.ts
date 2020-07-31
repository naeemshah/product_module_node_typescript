import {
  DefaultCrudRepository,
  repository,
  Getter,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Category, Product} from '../../models';
import {MongoDataSource} from '../../datasources';
import {inject} from '@loopback/core';
import {ProductRepository} from '../product.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  string
> {
  private readonly products: HasManyRepositoryFactory<
    Product,
    typeof Category.prototype.id
  >;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('ProductRepository')
    productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Category, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
    );

    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
