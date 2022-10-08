import { Model, ModelObject, RelationMappingsThunk, ModelOptions, QueryContext } from 'objection';
import { Product } from './product.model';
import { ProductSchemaType } from '../schema';
import { db } from '../../config/db';

Model.knex(db);

export class CartItem extends Model {
  id: string;
  product_id: number;
  product: ProductSchemaType;
  quantity: number;
  cart_id: string;
  created_at: string;
  updated_at: string;
  
  static tableName = 'cart_items';

  static relationMappings: RelationMappingsThunk = () => ({
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: Product,
      join: {
        from: 'cart_items.product_id',
        to: 'products.id',
      }
    }
  })

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<any> {
    this.updated_at = new Date().toISOString();
  }
}

export type CartItemShape = ModelObject<CartItem>