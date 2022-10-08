import { Model, ModelObject, RelationMappingsThunk } from 'objection';
import { OrderItem, OrderItemShape } from './order_item.model';
import { db } from '../../config/db';

Model.knex(db);

export class OrderDetail extends Model {
  id: string;
  user_id: string;
  total: string;
  order_items: OrderItemShape[];
  created_at: string;
  updated_at: string;

  static tableName: string = 'order_details'

  static relationMappings: RelationMappingsThunk = () => ({
    order_items: {
      relation: Model.HasManyRelation,
      modelClass: OrderItem,
      join: {
        from: 'order_details.id',
        to: 'order_items.order_detail_id'
      }
    }
  })
}

export type OrderDetailShape = ModelObject<OrderDetail>;