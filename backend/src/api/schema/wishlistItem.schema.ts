import { z } from 'zod';
import { ProductSchemaType } from './product.schema';

const createWishlistItemSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  quantity: z.number().positive(),
  product_id: z.number({required_error: 'product id required'}).positive(),
  created_at: z.string(),
  updated_at: z.string(),
  wishlist_id: z.string({required_error: 'wishlist id required'}).uuid(),
})

const partialCreateWishlistItemSchema = createWishlistItemSchema.partial({
  quantity: true,
  created_at: true,
  updated_at: true,
})

type CreateWishlistItemType = z.infer<typeof partialCreateWishlistItemSchema>
type WishlistItemSchemaType = z.infer<typeof createWishlistItemSchema>
type DetailedWishlistItemSchemaType = WishlistItemSchemaType & {product: ProductSchemaType}
export { CreateWishlistItemType, WishlistItemSchemaType, DetailedWishlistItemSchemaType }