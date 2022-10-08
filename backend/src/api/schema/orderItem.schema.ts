import { z } from 'zod';

const createOrderItemSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  quantity: z.number().positive(),
  total: z.string().regex(new RegExp('^\d+\.\d{2}$')),
  order_detail_id: z.string({required_error: 'order detail id required'}).uuid(),
  product_id: z.number({required_error: 'product id required'}).positive(),
})

const partialOrderItemSchema = createOrderItemSchema.partial({
  quantity: true,
})

export type CreateOrderItemType = z.infer<typeof partialOrderItemSchema>