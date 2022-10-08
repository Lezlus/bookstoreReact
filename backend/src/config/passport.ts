import passport from "passport";
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import { userDAO } from '../api/dao/index';
import { Request, Response, NextFunction } from "express";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;

const cookieExtractor = (req: Request): string | null => {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['access_token']
  }
  return token;
}

passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: 'AurickKruger'
}, async (payload, done) => {
  try {
    let user = await userDAO.getUserByID(payload.sub);
    if (user) {
      return done(undefined, user)
    }
    return done(undefined, false)

  } catch (error) {
    done(error, false)
  }
}))

passport.use(new LocalStrategy( async (username, password, done) => {
  try {
    let user = await userDAO.getUserByUserName(username)

    if (!user) {
      return done(undefined, false, {message: 'Username Not Found'})
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) {return done(err)}
      if (isMatch) {
        return done(undefined, user, {message: 'User found'});
      }
      return done(undefined, false, { message: 'Invalid Password' })
    })
  } catch (e) {
    done(e)
  }
}))


