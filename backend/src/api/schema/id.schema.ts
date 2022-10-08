import { z } from 'zod';
const withId = z.object({
  id: z.number()
})

export type WithId = z.infer<typeof withId>