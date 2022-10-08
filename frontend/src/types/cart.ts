import { CartShape, CartItemShape } from '../../../backend/src/api/models';
import { CartItemCreateData } from '../../../backend/src/types/create';
import { CartItemDeleteData, CartItemUpdateData } from '../../../backend/src/types/update';
import { CartCheckOutData } from '../../../backend/src/types/request/cart';

interface CartItem extends CartItemShape {

}

interface Cart extends CartShape {

}

interface CartItemCreate extends CartItemCreateData {

}

interface CartItemDelete extends CartItemDeleteData {

}

interface CartItemUpdate extends CartItemUpdateData {

}

export type { CartItem, Cart, CartItemCreate, CartItemDelete, CartItemUpdate, CartCheckOutData }