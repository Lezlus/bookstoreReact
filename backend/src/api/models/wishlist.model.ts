import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { WishlistItem } from './wishlistItem.model';
import { DetailedWishlistItemSchemaType } from '../schema';
import { db } from '../../config/db';

Model.knex(db);

export class WishList extends Model {
  id: string
  name: string;
  user_id: string;
  wishlist_items: DetailedWishlistItemSchemaType[];
  is_default: boolean;
  created_at: string;
  updated_at: string;

  static tableName: string = 'wishlists';

  static relationMappings: RelationMappingsThunk = () => ({
    wishlist_items: {
      relation: Model.HasManyRelation,
      modelClass: WishlistItem,
      join: {
        from: 'wishlists.id',
        to: 'wishlist_items.wishlist_id'
      }
    }
  })
}

export type WishlistShape = ModelObject<WishList>