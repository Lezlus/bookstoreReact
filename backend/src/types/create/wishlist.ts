import { WishListSchemaType } from '../../api/schema';

type WishlistCreateData = Omit<WishListSchemaType, 'id' | 'is_default' | 'created_at' | 'updated_at' | 'wishlist_items' | 'user_id'>

export { WishlistCreateData };