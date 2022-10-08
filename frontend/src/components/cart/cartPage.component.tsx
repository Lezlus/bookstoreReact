import '../../css/cartPage.css';
import { faCirclePlus, faCircleMinus, faTrash  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Decimal } from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { cartKeys } from './queries';
import { userKeys } from '../userQueries';
import { useCart } from '../../hooks/queries/useCart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CartService from '../../services/cartService/cartService';
import CouponService from '../../services/couponService/couponService';
import { CartItem, CartItemDelete, CartItemUpdate, CartCheckOutData } from '../../types';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


type AddressType = {
  firstName: string
  lastName: string
  addressLine1: string
  city: string
  state: string
  zip: string
}

interface AddressFormElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement
  lastName: HTMLInputElement
  addressLine1: HTMLInputElement
  city: HTMLInputElement
  state: HTMLInputElement
  zip: HTMLInputElement
}

interface AddressFormElement extends HTMLFormElement {
  readonly elements: AddressFormElements
}

interface AddressProps {
  address: AddressType
  setAddressHandler(newAddress: AddressType): void
}

interface CouponFormElements extends HTMLFormControlsCollection {
  couponName: HTMLInputElement;
}

interface CouponFormElement extends HTMLFormElement {
  readonly elements: CouponFormElements;
}

interface CartItemProps {
  cartItem: CartItem;
  updateCartItem(cartItem: CartItemUpdate): void;
  removeCartItem(cartItem: CartItemDelete): void;
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

const AddressChangeModal = (props: AddressProps) => {
  const {address, setAddressHandler} = props;
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNewAddressChange = (e: React.FormEvent<AddressFormElement>) => {
    e.preventDefault();
    const newAddress: AddressType = {
      firstName: e.currentTarget.elements.firstName.value,
      lastName: e.currentTarget.elements.lastName.value,
      addressLine1: e.currentTarget.elements.addressLine1.value,
      city: e.currentTarget.elements.city.value,
      state: e.currentTarget.elements.state.value,
      zip: e.currentTarget.elements.zip.value,
    }
    setAddressHandler(newAddress);
  }

  return (
    <>
      <h5>Address <span onClick={handleShow}>Edit</span></h5>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='row g-3' onSubmit={handleNewAddressChange} noValidate >
            <Form.Group className='col-md-6'>
              <Form.Label>First Name</Form.Label>
              <Form.Control name='firstName' type='text' placeholder='Enter First Name' defaultValue={address.firstName} />
            </Form.Group>
            <Form.Group className='col-md-6'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control name='lastName' type='text' placeholder='Enter Last Name' defaultValue={address.lastName} />
            </Form.Group>
            <Form.Group className='col-12'>
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control name='addressLine1' type='text' placeholder='1234 Main St Apt #' defaultValue={address.addressLine1} />
            </Form.Group>
            <Form.Group className='col-md-6'>
              <Form.Label>City</Form.Label>
              <Form.Control name='city' type='text' defaultValue={address.city} />
            </Form.Group>
            <Form.Group className='col-md-3'>
              <Form.Label>State</Form.Label>
              <Form.Select name='state' defaultValue={address.state}>
                <option>State</option>
                <option value="NJ">NJ</option>
                <option value='NY'>NY</option>
                <option value='PA'>PA</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className='col-md-3'>
              <Form.Label>Zip</Form.Label>
              <Form.Control name='zip' type='text' defaultValue={address.zip} />
            </Form.Group>
            <Button variant='primary' type='submit' onClick={handleClose}>Save</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )

}


const CartItemComponent = (props: CartItemProps) => {
  const { cartItem, updateCartItem, removeCartItem } = props;

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const quantityPrice = Decimal.mul(cartItem.quantity, cartItem.product.price).toFixed(2);

  return (
    <div className='item-container'>
      <div className='product-img-wrapper'>
        <img
          className='img-fluid'
          alt='somebook'
          src={`images/${cartItem.product.img_path_sm}`}
          />
      </div>
      <div className='product-details'>
        <h5>{cartItem.product.title}</h5>
        <h6><span>Retail Price:</span> ${cartItem.product.price}</h6>
        <h6><span>Amount:</span> ${quantityPrice}</h6>
      </div>
      <div className='product-quantity'>
        <FontAwesomeIcon 
          onClick={(e) => updateCartItem({quantity: cartItem.quantity - 1, cart_item_id: cartItem.id})}
          icon={cartItem.quantity > 1 ? faCircleMinus : faTrash} 
          className='quantity-icon-change' 
        />
        <span className='product-quantity-input' onClick={handleShow}>{cartItem.quantity}</span>
        <FontAwesomeIcon 
          onClick={(e) => cartItem.quantity < 5 ? updateCartItem({quantity: cartItem.quantity + 1, cart_item_id: cartItem.id}): e.preventDefault()}
          icon={faCirclePlus} 
          className={cartItem.quantity < 5 ? 'quantity-icon-change': 'quantity-icon-change-disabled'} 
        />
      </div>
      <div className='product-actions'>
        <p onClick={(e: React.MouseEvent<HTMLParagraphElement>) => {removeCartItem({cart_item_id: cartItem.id})}}>Remove</p>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className='modal-quantity-list'>
            <li onClick={(e) => { handleClose(); removeCartItem({cart_item_id: cartItem.id}); }}>0 (delete)</li>
            <li onClick={(e) => { handleClose(); updateCartItem({quantity: 1, cart_item_id: cartItem.id}); }}>1</li>
            <li onClick={(e) => { handleClose(); updateCartItem({quantity: 2, cart_item_id: cartItem.id}); }}>2</li>
            <li onClick={(e) => { handleClose(); updateCartItem({quantity: 3, cart_item_id: cartItem.id}); }}>3</li>
            <li onClick={(e) => { handleClose(); updateCartItem({quantity: 4, cart_item_id: cartItem.id}); }}>4</li>
            <li onClick={(e) => { handleClose(); updateCartItem({quantity: 5, cart_item_id: cartItem.id}); }}>5</li>
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  )
}


const CartPage = () => {
  const cartQuery = useCart();
  const queryClient = useQueryClient();

  const [address, setAddress] = useState<AddressType>({
    firstName: 'Rafael',
    lastName: 'Kruger',
    addressLine1: '123 Meadow Rd.',
    city: 'Union City',
    state: 'PA',
    zip: '07087'
  })

  const [isCouponValid, setCouponValid] = useState<boolean | undefined>();
  const [coupon, setCoupon] = useState<string>('');
  const [openSpinner, setOpenSpinner] = useState(false);


  const cartItemUpdateMutation = useMutation((cartItem: CartItemUpdate) => {
    return CartService.updateItem(cartItem);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail);
    }
  })

  const cartItemRemoveMutation = useMutation((cartItem: CartItemDelete) => {
    return CartService.removeItem(cartItem);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail);
    }
  })

  const checkOutCartMutation = useMutation((checkoutData: CartCheckOutData) => {
    return CartService.checkout(checkoutData);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(cartKeys.detail);
      queryClient.invalidateQueries(userKeys.user);
    }
  })

  const onAddressChange = (newAddress: AddressType) => {
    setAddress(newAddress);
  }

  const handleCloseSpinner = () => {
    setOpenSpinner(false);
  }

  const handleToggleSpinner = () => {
    setOpenSpinner(!openSpinner);
  }

  const couponSubmit = async (e: React.FormEvent<CouponFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const couponName = e.currentTarget.elements.couponName.value;
    console.log(couponName);
    if (couponName) {
      const res = await CouponService.getByName(couponName);
      if (res.coupon) {
        setCoupon(res.coupon.discount_percent);
        setCouponValid(true);
      } else {
        setCouponValid(false);
      }
    }
  }

  if (cartQuery.isLoading) {
    return <div>Loading...</div>
  }
  if (cartQuery.isError) {
    return <div>Error...</div>
  }

  const applyCoupon = () => {
    let discount: string = '0.00';
    if (isCouponValid) {
      let productTotal = cartQuery.data.cart.total;
      discount = Decimal.mul(productTotal, coupon).toFixed(2);
    }
    return discount;
  }

  const getCartTotal = () => {
    let cartEstimatedTotal: string = '0.00';
    let cartSubTotal = cartQuery.data.cart.total
    cartEstimatedTotal = Decimal.sub(cartSubTotal, applyCoupon()).toFixed(2);
    return cartEstimatedTotal
  }

  const handleRemoveCartItem = (cartItem: CartItemDelete) => {
    cartItemRemoveMutation.mutate(cartItem);
  }

  const handleUpdateCartItem = (cartItem: CartItemUpdate) => {
    cartItemUpdateMutation.mutate(cartItem);
  }

  const handleBuyItems = async (e: React.MouseEvent<HTMLButtonElement>) => {
    handleToggleSpinner();
    const estimatedTotal = getCartTotal();
    await delay(5000);
    await checkOutCartMutation.mutateAsync({estimatedTotal});
    handleCloseSpinner();
  }


  return (
    <div className="container cart-container">
      <h3 className='cart-amount-items'>Cart <span>{cartQuery.data.cart.cart_items.length} Products</span></h3>
      <section className="cart-items">
        <ul>
          {cartQuery.data.cart.cart_items.map(item => 
            <CartItemComponent
              key={item.id}
              updateCartItem={handleUpdateCartItem}
              removeCartItem={handleRemoveCartItem}
              cartItem={item}
            />
          )}
        </ul>
      </section>
      <section className="checkout-products">
        <div className='summary-total-container'>
          <h4>Summary</h4>
          <div className='coupon-code-input-wrapper input-group mb-3'>
            <Form className={'row'} noValidate onSubmit={couponSubmit}>
              <Form.Group className='col-md-6'>
                <Form.Label>Enter a coupon</Form.Label>
                <Form.Control 
                  className={classNames('form-control', {'is-valid': isCouponValid, 'is-invalid': !isCouponValid && isCouponValid !== undefined})}
                  name='couponName' 
                  type='text' 
                  placeholder='Enter a coupon code' 
                />
              </Form.Group>
              <button type='submit' className='btn btn-outline-primary'>Use Coupon</button>
            </Form>
          </div>
          <p>Subtotal <span>{`$${cartQuery.data.cart.total}`}</span></p>
          <p>Discount <span>${applyCoupon()}</span></p>
          <p>Tax <span>..</span></p>
          <p>Estimated Total <span>${getCartTotal()}</span></p>
        </div>
        <div className='checkout-details'>
          <div className='address-container'>
            <AddressChangeModal address={address} setAddressHandler={onAddressChange}  />
            <div className='address-details-wrapper'>
              <h6>First Name: <span>{address.firstName}</span></h6>
              <h6>Last Name: <span>{address.lastName}</span></h6>
              <h6>Address Line 1: <span>{address.addressLine1}</span></h6>
              <h6>State: <span>{address.state}</span></h6>
              <h6>City: <span>{address.city}</span></h6>
              <h6>Zip: <span>{address.zip}</span></h6>
              
            </div>
          </div>
        </div>
        <div className='d-grid buy-button-wrapper'>
          <button className='btn btn-primary' type='button' onClick={handleBuyItems}>Buy</button>
        </div>
      </section>
      <Backdrop
        sx={{color: '#fff', zIndex: 999}}
        open={openSpinner}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  )
}

export default CartPage;