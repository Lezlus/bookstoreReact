import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { Product } from './product.model';
import { db } from '../../config/db';
import { ProductSchemaType } from '../schema'

Model.knex(db);

export class FavoriteItem extends Model {
  id: string;
  product_id: number;
  favorite_id: string;
  product: ProductSchemaType;
  created_at: string;
  updated_at: string;

  static tableName: string = 'favorite_items';

  static relationMappings: RelationMappingsThunk = () => ({
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: Product,
      join: {
        from: 'favorite_items.product_id',
        to: 'products.id'
      }
    }
  })
}

export type FavoriteItemShape = ModelObject<FavoriteItem>