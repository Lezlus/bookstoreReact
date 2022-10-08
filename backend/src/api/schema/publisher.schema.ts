import { z } from 'zod';
import { WithId } from './id.schema';

export const createPublisherSchema = z.object({
  name: z.string({required_error: 'name required'}).min(1, 'name too short')
})

type CreatePublisherType = z.infer<typeof createPublisherSchema>;
type PublisherSchemaType = CreatePublisherType & WithId;

export { CreatePublisherType, PublisherSchemaType }