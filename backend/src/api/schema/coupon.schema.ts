import { z } from 'zod';

const createCouponSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  name: z.string({required_error: 'name required'}).min(1),
  desc: z.string().min(1),
  discount_percent: z.number({required_error: 'discount required'}).positive()
})

export type CouponSchemaType = z.infer<typeof createCouponSchema>