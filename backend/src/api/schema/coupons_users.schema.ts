import { z } from 'zod';

const createCouponsUsersSchema = z.object({
  user_id: z.string({required_error: 'user id required'}).uuid(),
  coupon_id: z.string({required_error: 'coupon_id required'}).uuid()
})

export type CreateCouponUserType = z.infer<typeof createCouponsUsersSchema>