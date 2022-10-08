import express, { Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import cors from 'cors';
import { productRouter, publisherRouter, genreRouter, userRouter,
  cartRouter, couponRouter, favoriteRouter, orderDetailRouter, 
  wishlistItemsRouter, wishlistRouter} from './api/routes/index';

import { BaseError } from './api/error-handler';
import { ErrorCode } from './api/error-handler/types/errorCode';

class Server {
  app: express.Application;
  accountRateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 60 * 1000, // 30sec
    max: 10,
    message: {message: 'too many requests'},
    standardHeaders: true,
    legacyHeaders: false,
  })

  constructor() {
    this.app = express();
    this.setUp();
  }

  setUp() {
    this.setUpMiddleware();
    this.setUpRoutes();
    this.setUpErrorHandling()
  }

  setUpRoutes() {
    this.app.use('/books', productRouter);
    this.app.use('/publishers', publisherRouter);
    this.app.use('/genres', genreRouter);
    this.app.use('/users', this.accountRateLimiter, userRouter);
    this.app.use('/carts', cartRouter);
    this.app.use('/coupons', couponRouter);
    this.app.use('/favorites', favoriteRouter);
    this.app.use('/order-details', orderDetailRouter);
    this.app.use('/wishlist-items', wishlistItemsRouter);
    this.app.use('/wishlists', wishlistRouter);
  }

  setUpMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true
    }));
    this.app.use(cookieParser());
    this.app.use(helmet())
  }

  setUpErrorHandling() {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof BaseError) {
        res.status(err.statusCode).json(err.responseBody);
      } else {
        res.status(500).json({code: ErrorCode.UnknownError, status: 500});
      }
    })
  }

  run(port: number) {
    this.app.listen(port, () => {
      console.log(`server running on port ${port}`)
    })
  }
}

export const server = new Server();