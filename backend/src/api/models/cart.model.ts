import { Model, ModelObject, RelationMappings, RelationMappingsThunk, ModelOptions, QueryContext } from 'objection';
import { CartItem, CartItemShape } from './cart_item.model';
import { db } from '../../config/db';

Model.knex(db);

export class Cart extends Model {
  id: string;
  user_id: string;
  total: string;
  cart_items: CartItemShape[];
  created_at: string;
  updated_at: string;

  static tableName = 'carts';

  static relationMappings: RelationMappingsThunk = () => ({
    cart_items: {
      relation: Model.HasManyRelation,
      modelClass: CartItem,
      join: {
        from: 'carts.id',
        to: 'cart_items.cart_id'
      }
    }
  })

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<any> {
    this.updated_at = new Date().toISOString();
  }
}

export type CartShape = ModelObject<Cart>;