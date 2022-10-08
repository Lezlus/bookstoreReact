import { Request, Response, NextFunction } from 'express';
import { couponDAO } from '../dao';
import { CustomExpressResponse, CouponResponse } from '../../types/response';

const getCoupons = async (request: Request, res: Response, next: NextFunction) => {
  const coupons = await couponDAO.getCoupons();
  res.status(200).json(coupons);
}

const getCoupon = async (req: Request<{name: string}>, res: CustomExpressResponse<CouponResponse>, next: NextFunction) => {
  const name = req.params.name;
  console.log(name)
  const coupon = await couponDAO.getCouponByName(name);
  res.status(200).json({coupon});
}

export { getCoupons, getCoupon }