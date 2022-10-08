import { z } from 'zod';

const createFavoriteItemSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  product_id: z.number({required_error: 'product_id required'}).positive(),
  favorite_id: z.string({required_error: 'favorite_id required'}).uuid(),
})

const favoriteItemSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  product_id: z.number({required_error: 'product_id required'}).positive(),
  favorite_id: z.string({required_error: 'favorite_id required'}).uuid(),
  created_at: z.string(),
  updated_at: z.string()
})

type CreateFavoriteItemType = z.infer<typeof createFavoriteItemSchema>
type FavoriteItemType = z.infer<typeof favoriteItemSchema>;

export { CreateFavoriteItemType, FavoriteItemType };