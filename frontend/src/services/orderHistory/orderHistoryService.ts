import { OrderDetailResponse } from "../../../../backend/src/types/response";
import { fetchData } from '../utility';

class OrderDetailService {
  static baseUrl: string = 'http://localhost:5000/order-details'
  static getById(id: string): Promise<OrderDetailResponse> {
    return fetchData<OrderDetailResponse>(`${this.baseUrl}/${id}`, {
      method: 'GET',
      credentials: 'include'
    })
  }
}

export default OrderDetailService;