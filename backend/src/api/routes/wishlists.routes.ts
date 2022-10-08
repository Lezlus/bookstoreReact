import { createWishlist, getWishlist, updateWishlist, deleteWishlist } from '../controllers';
import { Router } from 'express';
import '../../config/passport';
import passport from 'passport';

const router = Router();

router.post('/create-wishlist', passport.authenticate('jwt', {session: false}), createWishlist);
router.put('/update-wishlist', passport.authenticate('jwt', {session: false}), updateWishlist);
router.delete('/delete-wishlist', passport.authenticate('jwt', {session: false}), deleteWishlist);
router.get('/:id', passport.authenticate('jwt', {session: false}), getWishlist);

export { router }