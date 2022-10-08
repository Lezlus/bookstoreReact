import '../../config/passport';
import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, authenticated } from '../controllers';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', passport.authenticate('jwt', {session: false}), logout);
router.get('/authenticated', passport.authenticate('jwt', {session: false}), authenticated);

export { router }
