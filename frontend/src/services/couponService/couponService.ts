import { CouponResponse } from "../../../../backend/src/types/response";
import { fetchData } from "../utility";

class CouponService {
  static couponUrl = 'http://localhost:5000/coupons'

  static getByName(name: string): Promise<CouponResponse> {
    return fetchData<CouponResponse>(`${this.couponUrl}/${name}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }
}

export default CouponService;