import { createWishlistItem, deleteWishlistItems, updateWishlistItemQuantity } from '../controllers'
import { Router } from 'express'
import '../../config/passport';
import passport from 'passport';

const router = Router();
router.post('/create-wishlist-item', passport.authenticate('jwt', {session: false}), createWishlistItem);
router.put('/update-wishlist-item', passport.authenticate('jwt', {session: false}), updateWishlistItemQuantity);
router.delete('/delete-wishlist-item', passport.authenticate('jwt', {session: false}), deleteWishlistItems);

export { router }