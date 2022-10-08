import { WishlistItemSchemaType } from '../../api/schema';

type WishlistItemUpdateData = Omit<WishlistItemSchemaType, 'product_id' | 'created_at' | 'updated_at' | 'wishlist_id'>

export { WishlistItemUpdateData }