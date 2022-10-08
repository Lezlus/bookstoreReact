import { Request, Response, NextFunction } from 'express';
import { orderDetailDAO } from '../dao';
import { OrderDetailResponse, CustomExpressResponse } from '../../types/response';
import { API404Error } from '../error-handler';

const getOrderDetail = async (req: Request<{id: string}>, res: CustomExpressResponse<OrderDetailResponse>, next: NextFunction) => {
	const id = req.params.id;
	const orderDetail = await orderDetailDAO.getOrderDetail(id)
	if (orderDetail) {
    res.status(200).json({order_detail: orderDetail});  
	} else {
    next(new API404Error('Order Detail Not Found'))
  }
}
export { getOrderDetail };