import { z } from 'zod';

const createWishlist_WishlistItemSchema = z.object({
  wishlist_id: z.string({required_error: 'wihslist id required'}).uuid(),
  wishlist_item_id: z.string({required_error: 'wishlist item id required'}).uuid()
})

export type CreateWishlist_WishlistItemType = z.infer<typeof createWishlist_WishlistItemSchema>
