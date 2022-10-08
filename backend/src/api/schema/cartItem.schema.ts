import { z } from 'zod';
import { ProductSchemaType } from './product.schema';

export const createCartItemSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  product_id: z.number({required_error: 'product id required'}).positive(),
  quantity: z.number({required_error: 'quantity required'}).positive(),
  cart_id: z.string({required_error: 'cart id required'}).uuid(),
  created_at: z.string(),
  updated_at: z.string(),
})

const partialCreateCartItemSchema = createCartItemSchema.partial({
  created_at: true,
  updated_at: true,
})

type CreateCartItemType = z.infer<typeof partialCreateCartItemSchema>
type CartItemSchemaType = z.infer<typeof createCartItemSchema> & {product: ProductSchemaType}

export { CartItemSchemaType, CreateCartItemType }