import { CartResponse, SuccessfulPostResponse } from "../../../../backend/src/types/response";
import { fetchData } from "../utility";
import { CartItemCreate, CartItemDelete, CartItemUpdate, CartCheckOutData } from '../../types';

class CartService {
  static cartUrl = 'http://localhost:5000/carts';

  static get(): Promise<CartResponse> {
    return fetchData<CartResponse>(`${this.cartUrl}`, {
      method: 'GET',
      credentials: 'include'
    })
  }

  static addItem(data: CartItemCreate): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.cartUrl}/add-item-to-cart`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static addItems(data: CartItemCreate[]): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.cartUrl}/add-items-to-cart`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static removeItem(data: CartItemDelete): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.cartUrl}/remove-item-from-cart`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static updateItem(data: CartItemUpdate): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.cartUrl}/change-item-quantity`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static checkout(data: CartCheckOutData): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.cartUrl}/checkout-cart`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }
}

export default CartService;