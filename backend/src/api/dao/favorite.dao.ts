import { Favorite } from "../models";
import { v4 as uuidv4 } from 'uuid';

class FavoriteDAO {
  async createFavorite(user_id: string) {
    const id = uuidv4();

    await Favorite.query().insert({
      id,
      user_id
    })
  }

  async getFavorite(favorite_id: string) {
    const favorite = await Favorite.query().findById(favorite_id)
      .withGraphFetched('favorite_items.product')
    if (!favorite) {
      throw new Error('Favorite Not Found')
    }
    return favorite;
  }
}

export const favoriteDAO = new FavoriteDAO();