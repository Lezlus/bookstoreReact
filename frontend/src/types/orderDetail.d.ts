import { OrderDetailShape, OrderItemShape } from '../../../backend/src/api/models';

interface OrderDetail extends OrderDetailShape {

}

interface OrderItem extends OrderItemShape {

}

export type { OrderDetail, OrderItem }