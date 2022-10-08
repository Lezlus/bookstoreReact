import { Request, Response, NextFunction } from 'express';
import { wishlistItemDAO, wishlistDAO } from '../dao';
import { API404Error } from '../error-handler';
import { CustomExpressResponse, SuccessfulPostResponse } from '../../types/response';
import { WishlistItemCreateData } from '../../types/create';
import { WishlistItemUpdateData } from '../../types/update';

const createWishlistItem = async (req: Request<{}, {}, WishlistItemCreateData>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    const { product_id, quantity, wishlist_id } = req.body;
    const wishlistItem = await wishlistItemDAO.wishlistItemExists(wishlist_id, product_id)
    let message = '';
    if (wishlistItem) {
      message = 'Duplicate product exists, updating instead'
      const newQuantity = wishlistItem.quantity + quantity;
      await wishlistItemDAO.updateWishlistItem(wishlistItem.id, newQuantity);
    } else {
      message = 'Wishlist Item Created'
      await wishlistItemDAO.createWishlistItem(product_id, quantity, wishlist_id)
    }
    res.status(201).json({successful: true, message})
  }

const deleteWishlistItems = async (req: Request<{}, {}, {ids: string[]}>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    const { ids } = req.body;
    const deleteItemsCallStack: Promise<void>[] = [];

    for (let wishlistItemId of ids) {
      deleteItemsCallStack.push(wishlistItemDAO.deleteWishlistItem(wishlistItemId))
    }
    await Promise.all(deleteItemsCallStack);
    res.status(201).json({successful: true, message: 'Wishlist Items Deleted'});
  }

const updateWishlistItemQuantity = async (req: Request<{}, {}, WishlistItemUpdateData>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    const { id, quantity } = req.body;
    await wishlistItemDAO.updateWishlistItem(id, quantity);
    res.status(201).json({successful: true, message: 'Wishlist Item Updated'});
  }

export { createWishlistItem, deleteWishlistItems, updateWishlistItemQuantity }