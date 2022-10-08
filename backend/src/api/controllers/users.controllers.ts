import { Request, Response, NextFunction } from 'express';
import { userDAO } from '../dao';
import { User } from '../models';
import JWT from 'jsonwebtoken';
import passport from 'passport';
import '../../config/passport';
import { CustomExpressResponse, UserRegisterResponse, UserAuthResponse } from '../../types/response';
import { UserAPIError } from '../error-handler';

const signToken = (userID: string) => {
  return JWT.sign({
    iss: 'AurickKruger',
    sub: userID
  }, 'AurickKruger', {expiresIn: '1h'})
}

const register = async (req: Request<{}, {}, {username: string, password: string, 
  first_name: string, last_name: string}>, res: CustomExpressResponse<UserRegisterResponse>, next: NextFunction): Promise<void> => {
  const {username, password, first_name, last_name} = req.body;
  const foundUser = await userDAO.getUserByUserName(username);

  if (!foundUser) {
    await userDAO.createUser(username, password, first_name, last_name);
    res.status(201).json({message: {userTaken: false, msgError: false}})
  } else {
    res.status(400).json({message: {userTaken: true, msgError: true}})
  }
}

const login = async (req: Request, res: CustomExpressResponse<UserAuthResponse>, next: NextFunction): Promise<void> => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    const errMessage: string = info.message;
    if (err) {return next(new UserAPIError(errMessage))}
    if (user) {
      const customUser: User = user;
      const token = signToken(customUser.id);
      res.cookie('access_token', token, {httpOnly: true, sameSite: true});
      customUser.password = '';
      res.status(201).json({isAuthenticated: true, user: customUser})
      // if (req.isAuthenticated()) {
      //   const user = req.user;
      //   const token = signToken(user.id);
      //   res.cookie('access_token', token, {httpOnly: true, sameSite: true});
      //   res.status(200).json({isAuthenticated: true, user})
      // }
    } else {
      return next(new UserAPIError('User Not Found'))
    }
  })(req, res, next);
}

const logout = async (req: Request, res: CustomExpressResponse<UserAuthResponse>): Promise<void> => {
  res.clearCookie('access_token');
  res.status(200).json({isAuthenticated: false, user: null});
}

const authenticated = async (req: Request, res: CustomExpressResponse<UserAuthResponse>, next: NextFunction): Promise<void> => {
  if (req.isAuthenticated()) {
    const user = req.user;
    res.status(200).json({isAuthenticated: true, user});
  } else {
    next(new UserAPIError('User not authenticated'));
  }
}

export { register, login, logout, authenticated }