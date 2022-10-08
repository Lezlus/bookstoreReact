import { getOrderDetail } from '../controllers';
import { Router } from 'express';
import '../../config/passport';
import passport from 'passport';

const router = Router();

router.get('/:id', passport.authenticate('jwt', {session: false}), getOrderDetail);

export { router }