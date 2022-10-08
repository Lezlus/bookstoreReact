import { FavoriteItem } from "../models";
import { v4 as uuidv4 } from 'uuid';

class FavoriteItemDAO {
  async createFavoriteItem(product_id: number, favorite_id: string) {
    const id = uuidv4();
    await FavoriteItem.query().insert({id, product_id, favorite_id})
  }

  async deleteFavoriteItem(favorite_item_id: string) {
    await FavoriteItem.query().deleteById(favorite_item_id);
  }
}

export const favoriteItemDAO = new FavoriteItemDAO();