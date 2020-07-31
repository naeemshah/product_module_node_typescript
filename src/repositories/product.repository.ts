import {
  DefaultCrudRepository,
  BelongsToAccessor,
  repository,
} from '@loopback/repository';
import {Product, Category, Unit} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category/category.repository';
import {UnitRepository} from './unit/unit.repository';

export class ProductRepository extends DefaultCrudRepository<Product, string> {
  public readonly category: BelongsToAccessor<
    Category,
    typeof Product.prototype.id
  >;
  public readonly unit: BelongsToAccessor<Unit, typeof Product.prototype.id>;
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    // @repository(CategoryRepository) categoryRepository: CategoryRepository,
    @repository.getter('CategoryRepository')
    categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('UnitRepository')
    unitRepositoryGetter: Getter<UnitRepository>,
  ) {
    super(Product, dataSource);
    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );

    this.unit = this.createBelongsToAccessorFor('unit', unitRepositoryGetter);

    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.registerInclusionResolver('unit', this.unit.inclusionResolver);
  }
}
