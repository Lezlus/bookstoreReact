import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string({required_error: 'id required'}).uuid(),
  username: z.string({required_error: 'username required'}).min(1),
  password: z.string({required_error: 'password required'}).min(1),
  first_name: z.string({required_error: 'firstName required'}).min(1),
  last_name: z.string({required_error: 'lastName required'}).min(1)
})

export type CreateUserType = z.infer<typeof createUserSchema>