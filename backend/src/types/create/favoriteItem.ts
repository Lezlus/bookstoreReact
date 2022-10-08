import { CreateFavoriteItemType } from '../../api/schema';

type FavoriteItemCreateData = Omit<CreateFavoriteItemType, 'id'>;
type FavoriteItemDeleteData = Omit<CreateFavoriteItemType, 'favorite_id' | 'product_id'>;

export { FavoriteItemCreateData, FavoriteItemDeleteData };