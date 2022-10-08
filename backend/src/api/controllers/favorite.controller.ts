import { Request, Response, NextFunction } from 'express';
import { favoriteDAO } from '../dao';
import { FavoriteResponse, CustomExpressResponse } from '../../types/response';

const getFavorite = async (req: Request<{id: string}>, res: CustomExpressResponse<FavoriteResponse>, next: NextFunction) => {
  const id = req.params.id;
  const favorite = await favoriteDAO.getFavorite(id);
  res.status(200).json({favorite});
}

export { getFavorite }