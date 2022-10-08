import { z } from 'zod';
import { WithId } from './id.schema';

export const createGenreSchema = z.object({
  name: z.string({required_error: 'name required'}).min(1, 'name too short')
})



type CreateGenreType = z.infer<typeof createGenreSchema>;
type GenreSchemaType = CreateGenreType & WithId;

export { CreateGenreType, GenreSchemaType }