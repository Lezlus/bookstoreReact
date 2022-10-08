import { Request, Response, NextFunction } from 'express';
import { wishlistDAO } from '../dao';
import { WishlistResponse, CustomExpressResponse, SuccessfulPostResponse } from '../../types/response';
import { API404Error, UserAPIError } from '../error-handler';
import { WishlistCreateData } from '../../types/create';
import { WishlistUpdateData } from '../../types/update';

const createWishlist = async (req: Request<{}, {}, WishlistCreateData>, res: CustomExpressResponse<WishlistResponse>, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const { name } = req.body;
    let wishlist = await wishlistDAO.createWishlist(name, req.user.id);
    let fullWishlist = await wishlistDAO.getWishlist(wishlist.id);
    if (fullWishlist) {
      res.status(201).json({wishlist: fullWishlist})
    } else {
      next(new API404Error('Cannot Retrieve Wishlist'))
    }
  } else {
    next(new UserAPIError('User Error'))
  }
}

const getWishlist = async (req: Request<{id: string}>, res: CustomExpressResponse<WishlistResponse>, next: NextFunction) => {
  const id = req.params.id;
  let wishlist = await wishlistDAO.getWishlist(id);
  if (wishlist) {
    res.status(200).json({wishlist})
  } else {
    next(new API404Error('Cannot Retrieve Wishlist'))
  }
}

const updateWishlist = async (req:Request<{}, {}, WishlistUpdateData>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
  const { name, id } = req.body;
  await wishlistDAO.updateWishlist(id, name);
  res.status(201).json({successful: true, message: 'Updated Wishlist'})
}

const deleteWishlist = async (req: Request<{}, {}, {id: string}>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    const { id } = req.body;
    await wishlistDAO.deleteWishlist(id);
    res.status(201).json({successful: true, message: 'Deleted Wishlist'})
}

export { createWishlist, getWishlist, updateWishlist, deleteWishlist }