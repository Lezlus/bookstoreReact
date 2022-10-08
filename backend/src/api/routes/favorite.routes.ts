import { getFavorite, createFavoriteItem, deleteFavoriteItem } from '../controllers'
import { Router } from 'express';
import '../../config/passport';
import passport from 'passport';

const router = Router();

router.post('/create-favorite-item', passport.authenticate('jwt', {session: false}), 
  createFavoriteItem);

router.delete('/delete-favorite-item', passport.authenticate('jwt', {session: false}),
  deleteFavoriteItem);

router.get('/:id', passport.authenticate('jwt', {session: false}), getFavorite);

export { router };