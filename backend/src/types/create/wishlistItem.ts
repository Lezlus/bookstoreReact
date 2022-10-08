import { WishlistItemSchemaType } from '../../api/schema';

type WishlistItemCreateData = Omit<WishlistItemSchemaType, 'id' | 'created_at' | 'updated_at'>
export { WishlistItemCreateData }