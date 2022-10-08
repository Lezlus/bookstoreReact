import { getPublisher } from '../controllers/index';
import { Router } from 'express';

const router = Router();

router.get('/:id', getPublisher);

export {router}