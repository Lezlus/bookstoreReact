import { CreateCartItemType } from '../../api/schema';

type CartItemCreateData = Omit<CreateCartItemType, 'id' | 'cart_id'>

export { CartItemCreateData }