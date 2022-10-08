import { z } from 'zod';

const createOrderDetailSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  user_id: z.string({required_error: 'user id required'}).uuid(),
  total: z.string({required_error: 'total required'}).regex(new RegExp('^\d+\.\d{2}$'))
})

export type OrderDetailSchemaType = z.infer<typeof createOrderDetailSchema>