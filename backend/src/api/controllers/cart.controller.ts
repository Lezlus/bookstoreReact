import { Request, Response, NextFunction } from 'express';
import { cartDAO, cartItemDAO, productDAO, orderDetailDAO, orderItemDAO } from '../dao';
import { CartShape } from '../models';
import { CartResponse, CustomExpressResponse, SuccessfulPostResponse } from '../../types/response'
import { CartItemCreateData } from '../../types/create';
import { CartCheckOutData } from '../../types/request/cart';
import { CartItemDeleteData, CartItemUpdateData } from '../../types/update';
import { UserAPIError } from '../error-handler';

const getCart = async (req: Request<{id: string}>, res: CustomExpressResponse<CartResponse>, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const cart_id = req.user.cart.id;
    const cart = await cartDAO.getCart(cart_id);
    res.status(200).json({cart});
  } else {
    next(new UserAPIError('User Error'))
  }
}

const addItemToCart = async (req: Request<{}, {}, CartItemCreateData>, res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const cart_id = req.user.cart.id;
    const {product_id, quantity} = req.body;
  
    await cartDAO.addItemToCart(product_id, cart_id, quantity, productDAO, cartItemDAO)
    res.status(201).json({successful: true, message: 'Added Cart Item'})
  } else {
    next(new UserAPIError('User Error'))
  }
}

const removeItemFromCart = async (req: Request<{}, {}, CartItemDeleteData>, res: CustomExpressResponse<SuccessfulPostResponse>, 
  next: NextFunction) => {
    if (req.isAuthenticated()) {
      const cart_id = req.user.cart.id;
      const { cart_item_id } = req.body;
      await cartDAO.removeItemFromCart(cart_item_id, cartItemDAO, cart_id);
      res.status(200).json({successful: true, message: 'Removed Cart Item'});
    } else {
      next(new UserAPIError('User Error'))
    }
  }

const addItemsToCart = async (req: Request<{}, {}, CartItemCreateData[]>,
  res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const cartItems = req.body;
      console.log(cartItems);
      const cart_id = req.user.cart.id;
  
      for (let cartItem of cartItems) {
        const { product_id, quantity } = cartItem;
        await cartDAO.addItemToCart(product_id, cart_id, quantity, productDAO, cartItemDAO)
      }
  
      // await Promise.all(addedItemsCall);
      res.status(201).json({successful: true, message: 'Added Cart Items'})
    } else {
      next(new UserAPIError('User Error'))
    }
}

const changeItemQuantity = async (req: Request<{}, {}, CartItemUpdateData>, res : CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const cart_id = req.user.cart.id;
    const { cart_item_id, quantity } = req.body;
    await cartDAO.changeItemQuantity(cart_item_id, quantity, cartItemDAO, cart_id);
    res.status(201).json({successful: true, message: 'Updated Cart Item'})
  } else {
    next(new UserAPIError('User Error'))
  }
}

const checkoutCart = async (req: Request<{}, {}, CartCheckOutData>, res: CustomExpressResponse<SuccessfulPostResponse>, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const { estimatedTotal } = req.body;
    console.log(estimatedTotal);
    const user = req.user;
    await cartDAO.checkOutCart(estimatedTotal, user.cart.id, cartItemDAO, orderItemDAO, orderDetailDAO)
    res.status(200).json({successful: true, message: 'Checked out cart'});
  } else {
    next(new UserAPIError('User Error'))
  }
}

export { getCart, addItemToCart, removeItemFromCart, addItemsToCart, changeItemQuantity, 
  checkoutCart} 