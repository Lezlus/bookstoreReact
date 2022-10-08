import { WishList } from "../models";
import { v4 as uuidv4 } from 'uuid';

class WishlistDAO {
  async createWishlist(name: string, user_id: string, is_default=false) {
    const id = uuidv4();

    const newWishlist = await WishList.query().insert({
      id,
      name,
      user_id,
      is_default
    }).returning('*')
    return newWishlist
  }

  async getWishlist(id: string) {
    let wishlist = await WishList.query().findById(id)
      .withGraphFetched('wishlist_items.product');
    return wishlist;
  }

  async updateWishlist(id: string, name: string) {
    await WishList.query().patch({name}).findById(id);
  }

  async deleteWishlist(id: string) {
    await WishList.query().deleteById(id);
  }

}

export const wishlistDAO = new WishlistDAO();