import { OrderItem } from "../models";
import { v4 as uuidv4 } from 'uuid';

interface OrderItemInterface {
  createOrderItem: (quantity: number, total: string, order_detail_id: string, 
    product_id: number) => Promise<void>
}

class OrderItemDAO implements OrderItemInterface {
  async createOrderItem(quantity: number, total: string, order_detail_id: string, 
    product_id: number) {
      const id = uuidv4()
      await OrderItem.query().insert({id, quantity, total, order_detail_id, product_id});
    }
}

const orderItemDAO = new OrderItemDAO();
export { orderItemDAO, OrderItemInterface }