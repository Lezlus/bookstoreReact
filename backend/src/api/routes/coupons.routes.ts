import { getCoupons, getCoupon } from "../controllers";
import { Router } from 'express';
import '../../config/passport';
import passport from 'passport';

const router = Router();

router.get('/', getCoupons);
router.get('/:name', getCoupon);

export { router };