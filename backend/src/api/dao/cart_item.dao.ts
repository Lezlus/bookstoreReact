import { CartItem } from "../models";
import { v4 as uuidv4 } from 'uuid';

interface CartItemDAOInterface {
  createCartItem: (cart_id: string, product_id: number, quantity: number) => Promise<void>
  getCartItem: (id: string) => Promise<CartItem>
  updateCartItem: (id: string, quantity: number) => Promise<void>
  deleteCartItem: (id: string) => Promise<void>
}

class CartItemDAO implements CartItemDAOInterface {
  async createCartItem(cart_id: string, product_id: number, quantity: number): Promise<void> {
    const id = uuidv4();

    await CartItem.query().insert({
      id,
      cart_id,
      product_id,
      quantity
    })
  }

  async getCartItem(id: string): Promise<CartItem> {
    const cartItem = await CartItem.query().findById(id)
      .withGraphFetched('product')

    if (!cartItem) {
      throw new Error('Cart Item Not Found');
    }
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<void> {
    await CartItem.query()
      .patch({quantity})
      .findById(id)
  }

  async deleteCartItem(id: string): Promise<void> {
    await CartItem.query().deleteById(id);
  }
}

const cartItemDAO = new CartItemDAO();

export { cartItemDAO, CartItemDAOInterface }