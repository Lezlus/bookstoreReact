import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { Product } from './product.model';
import { db } from '../../config/db';
import { ProductSchemaType } from '../schema';

Model.knex(db);

export class OrderItem extends Model {
  id: string;
  quantity: number;
  total: string;
  order_detail_id: string;
  product_id: number;
  product: ProductSchemaType;
  created_at: string;
  updated_at: string;

  static tableName: string = 'order_items';

  static relationMappings: RelationMappingsThunk = () => ({
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: Product,
      join: {
        from: 'order_items.product_id',
        to: 'products.id'
      }
    }
  })
}

export type OrderItemShape = ModelObject<OrderItem>