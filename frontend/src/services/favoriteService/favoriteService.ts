import { FavoriteResponse, SuccessfulPostResponse } from '../../../../backend/src/types/response';
import { fetchData } from '../utility';
import { FavoriteItemCreate, FavoriteItemDelete } from '../../types';

class FavoriteService {
  static favoriteUrl = 'http://localhost:5000/favorites';

  static getById(id: string): Promise<FavoriteResponse> {
    return fetchData<FavoriteResponse>(`${this.favoriteUrl}/${id}`, {
      method: 'GET',
      credentials: 'include'
    })
  }

  static addItem(data: FavoriteItemCreate): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.favoriteUrl}/create-favorite-item`, {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }

  static deleteItem(data: FavoriteItemDelete): Promise<SuccessfulPostResponse> {
    return fetchData<SuccessfulPostResponse>(`${this.favoriteUrl}/delete-favorite-item`, {
      method: "DELETE",
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }
}

export default FavoriteService;