import { WishlistItem } from "../models";
import { v4 as uuidv4 } from 'uuid';

class WishlistItemDAO {
  async createWishlistItem(product_id: number, quantity: number, wishlist_id: string) {
    const id = uuidv4()

    await WishlistItem.query().insert({id, product_id, quantity, wishlist_id})
  }

  async updateWishlistItem(wishlistItemId: string, quantity: number) {
    await WishlistItem.query().patch({quantity}).findById(wishlistItemId)
  }

  async deleteWishlistItem(wishlistItemId: string) {
    await WishlistItem.query().deleteById(wishlistItemId);
  }

  async wishlistItemExists(wishlist_id: string, product_id: number): Promise<WishlistItem | undefined> {
    const wishlistItem = await WishlistItem.query()
      .findOne({
        product_id: product_id,
        wishlist_id: wishlist_id
      })
    return wishlistItem;
  }
}

export const wishlistItemDAO = new WishlistItemDAO();