import { z } from 'zod';
import { CartItemSchemaType } from './cartItem.schema';

const createCartSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  user_id: z.string({required_error: 'user id required'}).uuid(),
  total: z.string().regex(new RegExp('^\d+\.\d{2}$')),
  created_at: z.string(),
  updated_at: z.string(),
})

const partialCreateCartSchema = createCartSchema.partial({
  total: true,
  created_at: true,
  updated_at: true,
})

type CreateCartType = z.infer<typeof partialCreateCartSchema>
type CartSchemaType = z.infer<typeof createCartSchema> & {cart_items: CartItemSchemaType[]}

export { CartSchemaType, CreateCartType }