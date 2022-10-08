import { Model, ModelObject,  RelationMappingsThunk } from 'objection';
import { db } from '../../config/db';
import { Product } from './product.model';
import { ProductSchemaType } from '../schema/index';

Model.knex(db);

export class Publisher extends Model {
  id: number;
  name: string;
  products: ProductSchemaType[];
  created_at: string;
  updated_at: string;

  static tableName = 'publishers';

  static relationMappings: RelationMappingsThunk = () => ({
    products: {
      relation: Model.HasManyRelation,
      modelClass: Product,
      join: {
        from: 'publishers.id',
        to: 'products.publisher_id'
      }
    }
  })
}

export type PublisherShape = ModelObject<Publisher>