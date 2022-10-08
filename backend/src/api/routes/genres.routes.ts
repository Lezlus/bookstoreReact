import { getGenre } from '../controllers/index';
import { Router } from 'express';

const router = Router();

router.get('/:id', getGenre);

export { router }