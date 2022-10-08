import { WishlistResponse, SuccessfulPostResponse,  } from "../../../../backend/src/types/response";
import { fetchData } from '../utility';
import { WishlistCreate, WishlistUpdate, WishlistItemCreate, WishlistItemUpdate } from '../../types';

class WishlistService {
  static wishlistUrl = 'http://localhost:5000/wishlists'
  static wishlistItemURL = 'http://localhost:5000/wishlist-items'

  static createWishlist(data: WishlistCreate): Promise<WishlistResponse> {
    return fetchData<WishlistResponse>(`${this.wishlistUrl}/create-wishlist`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static getById(id: string): Promise<WishlistResponse> {
    return fetchData<WishlistResponse>(`${this.wishlistUrl}/${id}`, {
      method: 'GET',
      credentials: 'include'
    })
  }

  static updateWishlist(data: WishlistUpdate): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.wishlistUrl}/update-wishlist`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static deleteWishlist(data: {id: string}): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.wishlistUrl}/delete-wishlist`, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify(data)
    }
    )
  }

  static createWishlistItem(data: WishlistItemCreate): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.wishlistItemURL}/create-wishlist-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static updateWishlistItem(data: WishlistItemUpdate): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.wishlistItemURL}/update-wishlist-item`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static deleteWishlistItem(data: {ids: string[]}): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.wishlistItemURL}/delete-wishlist-item`, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }
  
}

export default WishlistService;