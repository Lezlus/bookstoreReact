import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import '../../css/orderHistoryPage.css'
import { useUser } from '../../hooks/queries/useUser';
import { orderDetailKeys } from './queries';
import { useQueries } from '@tanstack/react-query';
import OrderDetailService from '../../services/orderHistory/orderHistoryService';
import { OrderDetail, OrderItem } from '../../types';
import { dateFormatter } from '../utility/dateFormatter';

type OrderDetailComponentProps = OrderDetail
type OrderItemComponentProps = OrderItem

const OrderItemComponent = (props: OrderItemComponentProps) => {
  return (
    <div className='item row'>
      <div className='book-img col'>
        <img
          className='img-fluid'
          alt={props.product.title}
          src={`images/${props.product.img_path_sm}`}
        />
      </div>
      <div className='item-info col'>
        <h4>{props.product.title}</h4>
        <h4>{`Quantity: ${props.quantity}`}</h4>
        <h4>{`Total: $${props.total}`}</h4>
      </div>
    </div>
  )
}

const OrderDetailComponent = (props: OrderDetailComponentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleViewItemsClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(!isOpen);
  }

  const openDropDown = isOpen ? 'items open' : 'items'

  return (
    <div className='order-item'>
      <div className='order-item-details'>
        <h2>Order Id: <span className='detail'>{props.id}</span></h2>
        <h3>Order Placed: <span className='detail'>{dateFormatter(new Date(props.created_at))}</span></h3>
        <h3>Total: <span className='detail'>{`$${props.total}`}</span></h3>
        <div className='view-items-dropdown-wrapper flex'>
          <h3 onClick={handleViewItemsClick} className={`detail view-items-dropdown`}> View Items <FontAwesomeIcon icon={faSortDown} /></h3>
        </div>
      </div>
      <div className={`${openDropDown}`}>
        {
          props.order_items.map(orderItem => (
            <OrderItemComponent key={orderItem.id} {...orderItem} />
          ))
        }
      </div>
    </div>
  )
}


const OrderHistoryPage = () => {
  const userQuery = useUser();

  const userId = userQuery.data?.user?.id
  const userData = userQuery.data!.user!;

  const getDetail = async (id: string) => {
    const res = await OrderDetailService.getById(id);
    return res
  }

  const orderDetailQueries = useQueries({
    queries: userData!.order_details.map(orderDetail => {
      return {
        queryKey: orderDetailKeys.detail(orderDetail.id),
        queryFn: () => getDetail(orderDetail.id),
        enabled: !!userId
      }
    })
  })

  const isLoading = userQuery.isLoading && orderDetailQueries.some(query => query.isLoading)
  const isError = userQuery.isError && orderDetailQueries.some(query => query.isError)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  const showOrderHistory = () => {
    return orderDetailQueries.map(orderDetailQuery => {
      if (orderDetailQuery.data) {
        const orderDetail: OrderDetail = orderDetailQuery.data.order_detail;
        return <OrderDetailComponent key={orderDetail.id} {...orderDetail} />
      }
      return null
    })
  }

  return (
    <div className='container order-history-container'>
      <h1>User's Order History</h1>
      <div className='order-items'>
        { showOrderHistory() }
      </div> 
    </div>
  )
}

export default OrderHistoryPage;