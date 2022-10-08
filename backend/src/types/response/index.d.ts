import { Send } from 'express-serve-static-core';
import { Response } from 'express'

export { UserRegisterResponse, UserAuthResponse } from './user.response';
export { OrderDetailResponse } from './orderDetail.response';
export { WishlistResponse } from './wishlist.response'
export { CartResponse } from './cart.response';
export { FavoriteResponse } from './favorite.response';
export { ProductsResponse, ProductResponse, GenreProductsResponse, PublisherProductsResponse } from './product.response';
export { CouponResponse } from './coupon.response';

export interface SuccessfulPostResponse {
  successful: boolean;
  message?: string;
}

export interface CustomExpressResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}

