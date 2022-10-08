import { OrderDetail } from "../models";
import { v4 as uuidv4 } from 'uuid';
import { CartShape } from "../models";
import { OrderItemInterface } from './order_item.dao';
import Decimal from "decimal.js";

interface OrderDetailInterface {
  createOrderDetail(user_id: string, total: string): Promise<string>;
  getOrderDetail(orderDetailId: string): Promise<OrderDetail>;
}

class OrderDetailDAO implements OrderDetailInterface {
  async createOrderDetail(user_id: string, total: string) {
    const id = uuidv4()
    await OrderDetail.query().insert({id, user_id, total});
    return id;
  }

  async getOrderDetail(orderDetailId: string) {
    const orderDetail = await OrderDetail.query().findById(orderDetailId)
      .withGraphFetched('order_items.product')
    
    if (!orderDetail) {
      throw new Error('Order Detail Not Found')
    }
    return orderDetail;
  }
}
const orderDetailDAO = new OrderDetailDAO();
export { orderDetailDAO, OrderDetailInterface }