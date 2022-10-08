import { z } from 'zod';
import { WishlistItemSchemaType, DetailedWishlistItemSchemaType } from './wishlistItem.schema';


const wishlistSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  name: z.string({required_error: 'name required'}).min(1),
  user_id: z.string({required_error: 'user id required'}).uuid(),
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

type WishListSchemaType = z.infer<typeof wishlistSchema> & {wishlist_items: WishlistItemSchemaType[]}
type DetailedWishlistSchemaType = z.infer<typeof wishlistSchema> & {wishlist_items: DetailedWishlistItemSchemaType[]}

export { WishListSchemaType, DetailedWishlistItemSchemaType }