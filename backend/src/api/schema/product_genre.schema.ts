import { z } from 'zod';

const createProductGenreSchema = z.object({
  product_id: z.number({required_error: 'productId required'}).positive(),
  genre_id: z.number({required_error: 'genre_id required'}).positive()
})

export type CreateProductGenreType = z.infer<typeof createProductGenreSchema>