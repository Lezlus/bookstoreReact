import { WishListSchemaType } from '../../api/schema';

type WishlistUpdateData = Omit<WishListSchemaType, 'is_default' | 'user_id' | 'wishlist_items' | 'created_at' | 'updated_at'>

export { WishlistUpdateData }