import { getProduct, getAllProducts, getProductsByGenre, 
    getProductsByPublisher, gerProductsByPublisherAndGenre, getProductBySlug } from '../controllers/index';
import { Router } from 'express';

const router = Router();

router.get('/', getAllProducts);
router.get('/genre/:genres/publisher/:publishers', gerProductsByPublisherAndGenre);
router.get('/publisher/:name', getProductsByPublisher);
router.get('/genre/:name', getProductsByGenre);
router.get('/:id(\\d+)', getProduct);
router.get('/:slug', getProductBySlug);

export { router }