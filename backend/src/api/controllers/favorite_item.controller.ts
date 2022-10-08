import { Request, Response, NextFunction } from 'express';
import { favoriteItemDAO } from '../dao';
import { SuccessfulPostResponse, CustomExpressResponse } from '../../types/response';
import { FavoriteItemCreateData, FavoriteItemDeleteData } from '../../types/create';

const createFavoriteItem = async (req: Request<{}, {}, FavoriteItemCreateData>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    const { product_id, favorite_id } = req.body;
    await favoriteItemDAO.createFavoriteItem(product_id, favorite_id);
    res.status(201).json({successful: true, message: 'Favorite Item Created'})
  }

const deleteFavoriteItem = async (req: Request<{}, {}, FavoriteItemDeleteData>, 
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    const { id } = req.body;
    await favoriteItemDAO.deleteFavoriteItem(id);
    res.status(201).json({successful: true, message: 'Favorite Item Deleted'})
  }

export { createFavoriteItem, deleteFavoriteItem }