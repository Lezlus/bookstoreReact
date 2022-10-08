import { z } from 'zod';
import { WithId } from './id.schema';
import { GenreSchemaType } from './genre.schema';
import { PublisherSchemaType } from './publisher.schema';

export const createProductSchema = z.object({
  title: z.string({required_error: 'title required'}).min(1, 'title too short'),
  slug: z.string({required_error: 'slug required'}).min(1, 'slug too short'),
  desc: z.string(),
  price: z.string().regex(new RegExp('^\d+\.\d{2}$')),
  media: z.string(),
  publisher_id: z.number({required_error: 'number required'}).positive(),
  release_date: z.date(),
  themes: z.string(),
  age_rating: z.string(),
  page_count: z.string(),
  dimensional_weight: z.string(),
  is_erotica: z.boolean(),
  img_path_lg: z.string({required_error: 'Img path lg is required'}).min(1),
  img_path_sm: z.string(),
})

const partialCreateProductSchema = createProductSchema.partial({
  desc: true,
  media: true,
  release_date: true,
  themes: true,
  age_rating: true,
  page_count: true,
  dimensional_weight: true,
  is_erotica: true,
  img_path_sm: true,
})


type CreateProductType = z.infer<typeof partialCreateProductSchema>
type ProductSchemaType = z.infer<typeof createProductSchema> & WithId & {genres: GenreSchemaType[]} & {publisher: PublisherSchemaType}
export { CreateProductType, ProductSchemaType }