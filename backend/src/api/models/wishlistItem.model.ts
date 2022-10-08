import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { Product } from './product.model';
import { db } from '../../config/db';
import { ProductSchemaType } from '../schema'

Model.knex(db);

export class WishlistItem extends Model {
  id: string;
  quantity: number;
  product_id: number;
  wishlist_id: string;
  product: ProductSchemaType;
  created_at: string;
  updated_at: string;

  static tableName: string = 'wishlist_items'

  static relationMappings: RelationMappingsThunk = () => ({
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: Product,
      join: {
        from: 'wishlist_items.product_id',
        to: 'products.id'
      }
    }
  })
}

export type WishlistItemShape = ModelObject<WishlistItem>