import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { cartDAO } from './cart.dao';
import { wishlistDAO } from './wishlist.dao';
import { favoriteDAO } from './favorite.dao';


class UserDAO {
  async getUserByID(id: string) {
    const user = await User.query()
      .findById(id)
      .select('id', 'username', 'first_name', 'last_name', 'created_at', 'updated_at')
      .withGraphFetched('[cart.cart_items, wishlists.wishlist_items, favorite.favorite_items, order_details, coupons_used]')

    if (!user) {
      throw new Error(`User "${id}" Not Found`)
    }
    return user;
  }

  async getUserByUserName(username: string) {
    const user = await User.query().findOne({
      username
    })
    .withGraphFetched('[cart.cart_items, wishlists.wishlist_items, favorite.favorite_items, order_details.order_items, coupons_used]')
    return user
  }

  async getSafeUserByUserName(username: string) {
    const user = await User.query().findOne({
      username
    })
    .select('id', 'username', 'first_name', 'last_name','created_at', 'updated_at')
    .withGraphFetched('[cart.cart_items, wishlists.wishlist_items, favorite.favorite_items, order_details, coupons_used]')
    return user
  }

  async createUser(username: string, password: string, first_name: string, last_name: string): Promise<void> {
    const id = uuidv4();
    bcrypt.hash(password, 10, async (err, passwordHash) => {
      if (err) {
        throw err;
      }

      await User.query().insert({
        id,
        username,
        password: passwordHash,
        first_name,
        last_name
      })
      
      await cartDAO.createCart(id);
      await wishlistDAO.createWishlist('Default', id, true);
      await favoriteDAO.createFavorite(id);

    })
  }
} 

export const userDAO = new UserDAO();