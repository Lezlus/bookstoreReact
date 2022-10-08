import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { db } from '../../config/db';

Model.knex(db);

export class Coupon extends Model {
  id: string;
  name: string;
  desc: string;
  discount_percent: string;
  created_at: string;
  updated_at: string;

  static tableName: string = 'coupons';
}

export type CouponShape = ModelObject<Coupon>;