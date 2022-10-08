import { Coupon } from "../models";

class CouponDAO {
  async getCoupons(): Promise<Coupon[]> {
    const coupons = await Coupon.query()
    return coupons
  }

  async getCouponByName(name: string): Promise<Coupon | undefined> {
    const coupon = await Coupon.query().findOne({name});
    return coupon;
  }
}

export const couponDAO = new CouponDAO();