import { Request, Response, NextFunction } from 'express';
import { Genre } from '../models/genre.model';
import { genreDAO } from '../dao';

const getGenre = async (req: Request<{id: string}>, res: Response, next: NextFunction): Promise<void> => {
  const id = req.params.id;
  const genre = await genreDAO.getGenreById(parseInt(id))

  res.status(200).json(genre);
}

export { getGenre }