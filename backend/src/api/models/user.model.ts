import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { Cart } from './cart.model';
import { WishList } from './wishlist.model';
import { Favorite } from './favorite.model';
import { OrderDetail } from './orderdetail.model';
import { Coupon } from './coupon.model';
import { db } from '../../config/db';
import { WishListSchemaType, CartSchemaType, FavoriteSchemaType,
  OrderDetailSchemaType, CouponSchemaType, WishlistItemSchemaType} from '../schema/index';
import bcrypt from 'bcrypt';


type ComparePasswordCB = (error: any, isMatch: any) => void


Model.knex(db);

export class User extends Model {
  id: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  cart: CartSchemaType;
  wishlists: WishListSchemaType[];
  favorite: FavoriteSchemaType;
  order_details: OrderDetailSchemaType[];
  coupons_used: CouponSchemaType[];
  created_at: string;
  updated_at: string;

  static tableName = 'users';

  static relationMappings: RelationMappingsThunk = () => ({
    cart: {
      relation: Model.HasOneRelation,
      modelClass: Cart,
      join: {
        from: 'users.id',
        to: 'carts.user_id'
      }
    },
    wishlists: {
      relation: Model.HasManyRelation,
      modelClass: WishList,
      join: {
        from: 'users.id',
        to: 'wishlists.user_id'
      }
    },
    favorite: {
      relation: Model.HasOneRelation,
      modelClass: Favorite,
      join: {
        from: 'users.id',
        to: 'favorites.user_id'
      }
    },
    order_details: {
      relation: Model.HasManyRelation,
      modelClass: OrderDetail,
      join: {
        from: 'users.id',
        to: 'order_details.user_id'
      }
    },
    coupons_used: {
      relation: Model.ManyToManyRelation,
      modelClass: Coupon,
      join: {
        from: 'users.id',
        through: {
          from: 'coupons_users.user_id',
          to: 'coupons_users.coupon_id'
        },
        to: 'coupons.id'
      }
    }
  })

  comparePassword(candidatePassword: string, cb: ComparePasswordCB): void {
    bcrypt.compare(candidatePassword, this.password, (err: Error | undefined, isMatch: boolean) => {
      cb(err, isMatch);
    });
  }
}

export type UserShape = ModelObject<User>