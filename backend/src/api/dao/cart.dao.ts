import { Cart } from '../models';
import { ProductDAOInterface } from './product.dao';
import { CartItemDAOInterface } from './cart_item.dao';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from 'decimal.js';
import { OrderDetailInterface } from './orderDetail.dao';
import { OrderItemInterface } from './order_item.dao';
import { CartSchemaType } from '../schema';

class CartDAO {
  async createCart(user_id: string) {
    const id = uuidv4();

    await Cart.query().insert({
      id,
      user_id
    })
  }

  async getCart(id: string) {
    const cart = await Cart.query().findById(id)
      .withGraphFetched('cart_items.product');
    
    if (!cart) {
      throw new Error('Cart Not Found')
    }
    return cart
  }

  private async getCartItemViaProductId(cart_id: string, product_id: number) {
    const cart = await this.getCart(cart_id);
    const cartItem = cart.cart_items.find(cart_item => cart_item.product_id === product_id);

    if (!cartItem) {
      throw new Error('Cart Item not found');
    }
    return cartItem.id;
  }

  private async updateCart(cart_id: string, total: string) {
    await Cart.query().patch({total}).findById(cart_id)
  }

  private async productExists(cart_id: string, product_id: number) {
    const cart = await this.getCart(cart_id);
    
    const cartItem = cart.cart_items.find(cart_item => cart_item.product_id === product_id);

    return cartItem !== undefined;
  }

  async addItemToCart(product_id: number, cart_id: string, quantity: number, 
    productDAO: ProductDAOInterface, cartItemDAO: CartItemDAOInterface): Promise<void> {
      const product = await productDAO.getProduct(product_id);
      const cart = await cartDAO.getCart(cart_id);

      const totalPrice = Decimal.mul(product.price, quantity.toString())
      const newCartTotal = Decimal.add(cart.total, totalPrice.toString());


      const productExistsWithinCart = await this.productExists(cart_id, product_id);
      if (productExistsWithinCart) {
        const cartItemId = await this.getCartItemViaProductId(cart_id, product_id);
        const cartItem = await cartItemDAO.getCartItem(cartItemId);
        const totalQuantity = cartItem.quantity + quantity;

        await cartItemDAO.updateCartItem(cartItemId, totalQuantity)
      } else {
        await cartItemDAO.createCartItem(cart_id, product_id, quantity)
      }

      await this.updateCart(cart_id, newCartTotal.toString());
    }

  async removeItemFromCart(cart_item_id: string, cartItemDAO: CartItemDAOInterface, 
    cart_id: string): Promise<void> {
      await cartItemDAO.deleteCartItem(cart_item_id);
      let total = await this.calculateCartTotal(cart_id);
      await this.updateCart(cart_id, total);
    }

  async changeItemQuantity(cart_item_id: string, quantity: number, cartItemDAO: CartItemDAOInterface, 
    cart_id: string) {
      await cartItemDAO.updateCartItem(cart_item_id, quantity);
      let total = await this.calculateCartTotal(cart_id);
      await this.updateCart(cart_id, total);
  }

  async checkOutCart(estimatedTotal: string, cart_id: string, cartItemDAO: CartItemDAOInterface, orderItemDAO: OrderItemInterface, orderDetailDAO: OrderDetailInterface) {
    // Create order detail and order items
    // Delete all cart items and set cart total to 0.00
    let cart = await this.getCart(cart_id);

    const orderDetailId = await orderDetailDAO.createOrderDetail(cart.user_id, estimatedTotal);
    let createOrderItemsCallstack: Promise<void>[] = [];
    let deleteCartItemsCallstack: Promise<void>[] = [];

    for (let cartItem of cart.cart_items) {
      let orderItemTotal = Decimal.mul(cartItem.product.price, cartItem.quantity.toString());
      createOrderItemsCallstack.push(orderItemDAO.createOrderItem(
        cartItem.quantity,
        orderItemTotal.toString(),
        orderDetailId,
        cartItem.product.id
      ))
      deleteCartItemsCallstack.push(cartItemDAO.deleteCartItem(cartItem.id));
    }

    await Promise.all(createOrderItemsCallstack);
    await Promise.all(deleteCartItemsCallstack);
    await this.updateCart(cart.id, '0.00');
  }

  async calculateCartTotal(cart_id: string): Promise<string> {
    let total = new Decimal('0.00');
    let cart = await this.getCart(cart_id);
    for (let cartItem of cart.cart_items) {
      let productTotal = Decimal.mul(cartItem.product.price, cartItem.quantity.toString());
      total = Decimal.add(total, productTotal)
    }

    return total.toFixed(2);
  }

}

export const cartDAO = new CartDAO();