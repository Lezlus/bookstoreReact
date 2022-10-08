import { getCart, addItemToCart, removeItemFromCart, addItemsToCart, 
  changeItemQuantity, checkoutCart } from '../controllers'
import '../../config/passport';
import { Router } from 'express';
import passport from 'passport';

const router = Router()
router.post('/add-item-to-cart', passport.authenticate('jwt', {session: false}), addItemToCart);
router.post('/add-items-to-cart', passport.authenticate('jwt', {session: false}), addItemsToCart);
router.post('/remove-item-from-cart', passport.authenticate('jwt', {session: false}), removeItemFromCart);
router.post('/change-item-quantity', passport.authenticate('jwt', {session: false}), changeItemQuantity);
router.post('/checkout-cart', passport.authenticate('jwt', {session: false}), checkoutCart)
// Add middleware to check that user is only getting their cart
router.get('/', passport.authenticate('jwt', {session: false}), getCart)

export { router };