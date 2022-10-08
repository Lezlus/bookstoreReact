import { Request, Response, NextFunction } from 'express';
import { publisherDAO } from '../dao';

const getPublisher = async (req: Request<{id: string}>, res: Response, next: NextFunction): Promise<void> => {
  const id = req.params.id;
  const publisher = await publisherDAO.getPublisherById(parseInt(id));
  
  res.status(200).json(publisher);
}

export { getPublisher }