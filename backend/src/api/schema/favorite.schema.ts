import { z } from 'zod';
import { FavoriteItemType } from './favoriteItem.schema';

const createFavoriteSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  user_id: z.string({required_error: 'userId required'}).uuid()
})

export type FavoriteSchemaType = z.infer<typeof createFavoriteSchema> & {favorite_items: FavoriteItemType[]}