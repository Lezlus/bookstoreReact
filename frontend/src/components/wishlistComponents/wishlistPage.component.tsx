import '../../css/wishlistPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import { default as BootstrapButton } from 'react-bootstrap/Button'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import classNames from 'classnames';
import { dateFormatter } from '../utility/dateFormatter';
import { DropdownButton, FormControl } from 'react-bootstrap';
import { SortObjectType } from '../utility/itemSorting';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import WishlistService from '../../services/wishlistService/wishlistService';
import CartService from '../../services/cartService/cartService';
import { wishlistKeys } from './queries';
import { DetailedWishlist, WishlistCreate, WishlistItem, WishlistItemCreate, WishlistItemUpdate, CartItemCreate } from '../../types';
import { useParams } from 'react-router-dom';
import { useUser } from '../../hooks/queries/useUser';
import { useSortedWishlistQuery } from '../../hooks/queries/useSortedWishlistQuery';

const reverseSortObj = (sortObject: SortObjectType): SortObjectType => {
  let newSortObject: SortObjectType = {type: 'default'}
  switch (sortObject.type) {
    case 'default':
      newSortObject.type = 'defaultReversed'
      return newSortObject
    case 'sortByName': 
      newSortObject.type = 'sortByNameReversed'
      return newSortObject
    case 'sortByNameReversed': 
      newSortObject.type = 'sortByName';
      return newSortObject
    case 'sortByPrice':
      newSortObject.type = 'sortByPriceReversed';
      return newSortObject
    case 'sortByPriceReversed':
      newSortObject.type = 'sortByPrice'
      return newSortObject
    default:
      return newSortObject
  }
}


interface WishlistItemProps {
  itemChecked: boolean
  handleCheckItem(e: React.ChangeEvent<HTMLInputElement>): void
  handleMoveItem(toWishlistId: string, wishlistItem: WishlistItem): void
  handleCreateWishlistAndMoveItem(wishlistName: string, wishlistItem: WishlistItem): void
  handleEditWishlistItem(updatedItem: WishlistItem): void
  wishlistItem: WishlistItem
}

const WishlistItemComponent = (props: WishlistItemProps) => {
  const {itemChecked, handleCheckItem,
      handleMoveItem, wishlistItem, handleEditWishlistItem ,
    handleCreateWishlistAndMoveItem} = props;
  const [validated, setValidated] = useState<boolean>(false);
  const [newWishlistTitle, setNewWishlistTitle] = useState<string>('');
  const [updatedItemQuantity, setUpdatedItemQuantity] = useState<null | number>(null);
  const [show, setShow] = useState<boolean>(false);
  
  const userQuery = useUser();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateWishlistSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation()
    if (form.checkValidity()) {
      if (userQuery.data) {
        handleCreateWishlistAndMoveItem(newWishlistTitle, wishlistItem)
        setNewWishlistTitle('');
      }
    }
    setValidated(true);
  }

  const handleEditItemQuantity = () => {
    let updatedWishlistItem = {...wishlistItem}
    if (updatedItemQuantity) {
      updatedWishlistItem.quantity = updatedItemQuantity;
    }
    handleEditWishlistItem(updatedWishlistItem);
  }

  if (userQuery.isLoading) {
    return <div>Loading...</div>
  } else if (userQuery.isError) {
    return <div>Error...</div>
  }

  return (
    <li className='wishlist-item'>
      <Checkbox
        checked={itemChecked}
        onChange={handleCheckItem}
      />
      <div className='item-details-main'>
        <div className='product-img-wrapper'>
          <img 
            className='img-fluid'
            src={`/images${wishlistItem.product.img_path_sm}`}
            alt='productImage'
          />
        </div>
        <div className='product-details'>
          <div className='product-details-primary'>
            <h3>{wishlistItem.product.title}</h3>
            <p>Price: <span>${wishlistItem.product.price}</span></p>
          </div>
          <div className='item-details-secondary'>
            <div className='secondary-details'>
              <p>Desired Quantity: <span>{wishlistItem.quantity}</span></p>
              <p>{`Added on: ${dateFormatter(new Date(wishlistItem.created_at))}`}</p>
            </div>
            {
              userQuery.data.user && 
              <div className='item-actions'>
                <button type='button' className='btn btn-primary' onClick={handleShow}>Edit</button>
                <DropdownButton id='dropdown-move-item' title='Move Item'>
                  {userQuery.data.user.wishlists.map((item) => 
                    item.id !== wishlistItem.wishlist_id && <Dropdown.Item key={item.id} onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleClose(); 
                      handleMoveItem(item.id, wishlistItem);
                    }}>{item.name}</Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Form noValidate onSubmit={(e: React.MouseEvent<HTMLFormElement>) => { handleClose(); handleCreateWishlistSubmit(e);}} validated={validated}>
                    <Form.Group className='mb-3' controlId='newWishlistName'>
                      <Form.Label>Enter a Wishlist title</Form.Label>
                      <Form.Control
                        defaultValue={newWishlistTitle} 
                        required 
                        type='text' 
                        placeholder='Enter a name' 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setNewWishlistTitle(e.target.value)}}
                      />
                      <Form.Control.Feedback type='invalid'>Please type a title</Form.Control.Feedback>
                    </Form.Group>
                    <button type='submit' className='btn btn-primary'>Create and Move Item</button>
                  </Form>
                </DropdownButton>
              </div>
            }
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-product-container row'>
            <div className='modal-product-img-wrapper col-md-6'>
              <img 
                className='img-fluid'
                src={require('../../assets/images/book_info_1_imgs/small/Chainsaw Man Manga Volume 6_sm.jpg')} 
                alt='productImg' 
              />
            </div>
            <div className='modal-product-details col-md-6'>
              <div className='modal-product-details-primary'>
                <h5>{wishlistItem.product.title}</h5>
                <p>Added on: 9/99/9999</p>
                <p>Your Price: {wishlistItem.product.price}</p>
              </div>
              <div className='modal-product-change-quantity-input'>
                <Form.Select 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUpdatedItemQuantity(parseInt(e.target.value))}
                  name='quantityInput' 
                  defaultValue={wishlistItem.quantity}
                  >
                  <option>Chose a quantity</option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                </Form.Select> 
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant='secondary' onClick={handleClose}>
            Cancel
          </BootstrapButton>
          <BootstrapButton variant='primary' onClick={() => {handleClose(); handleEditItemQuantity()}}>
            Save
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </li>
  )
}

const WishlistPage = () => {
  const { wishlistId } = useParams<{ wishlistId: string }>();
  const queryClient = useQueryClient();

  const [filterBtnAnchorEl, setFilterBtnAnchorEl] = useState<null | HTMLElement>(null);
  const [sortObj, setSortObj] = useState<SortObjectType>({type: 'default'});
  const [selected, setSelected] = useState<readonly string[]>([]);

  const wishlistQuery = useSortedWishlistQuery(wishlistId!, sortObj);

  const isLoading = wishlistQuery.isLoading;
  const isError = wishlistQuery.isError;


  const open = Boolean(filterBtnAnchorEl);
  const handleFilterMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFilterBtnAnchorEl(e.currentTarget);
  }
  const handleFilterMenuClose = () => {
    setFilterBtnAnchorEl(null);
  }

  const moveWishlistItemMutation = useMutation((dataToMoveWishlistItem: WishlistItemCreate) => {
    return WishlistService.createWishlistItem(dataToMoveWishlistItem);
  })

  const updateWishlistItemMutation = useMutation((dataToUpdateWishlistItem: WishlistItemUpdate) => {
    return WishlistService.updateWishlistItem(dataToUpdateWishlistItem)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(wishlistKeys.detail(wishlistId!))
    }
  })

  const deleteWishlistItemsMutation = useMutation((ids: string[]) => {
    return WishlistService.deleteWishlistItem({ids})
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(wishlistKeys.detail(wishlistId!))
    }
  })

  const createWishlistMutation = useMutation((dataToCreateWishlist: WishlistCreate) => {
    return WishlistService.createWishlist(dataToCreateWishlist)
  })

  const addItemsToCartMutation = useMutation((items: CartItemCreate[]) => {
    return CartService.addItems(items);
  })

  const handleEditWishlistItem = (updatedWishlistItem: WishlistItemUpdate) => {
    updateWishlistItemMutation.mutate(updatedWishlistItem);
  }

  const handleCreateWishlistAndMoveItem= async (wishlistName: string, wishlistItem: WishlistItem) => {
    const newWishlist: WishlistCreate = {
      name: wishlistName,
    }

    const res = await createWishlistMutation.mutateAsync(newWishlist);
    const wishlistCreated: DetailedWishlist = res.wishlist;
    const newWishlistItem: WishlistItemCreate = {
      quantity: wishlistItem.quantity,
      product_id: wishlistItem.product_id,
      wishlist_id: wishlistCreated.id
    }
    await moveWishlistItemMutation.mutateAsync(newWishlistItem);
    await deleteWishlistItemsMutation.mutateAsync([wishlistItem.id])
    const selectedIndex = selected.indexOf(wishlistItem.id);
    if (selectedIndex > -1) {
      selectedChange(wishlistItem.id);
    }
  }

  const handleAddItemsToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const wishlistItemsToAdd: CartItemCreate[] = wishlistQuery.data.wishlist_items.filter((item) => selected.indexOf(item.id) > -1)
    .map((wishlistItem) => {
      return {
        quantity: wishlistItem.quantity,
        product_id: wishlistItem.product_id,
      }
    })

    await addItemsToCartMutation.mutateAsync(wishlistItemsToAdd);
    await deleteWishlistItemsMutation.mutateAsync([...selected])
    let newSelected: readonly string[] = [];
    setSelected(newSelected)
  }

  const handleRemoveItemsClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let newSelected: readonly string[] = [];
    await deleteWishlistItemsMutation.mutateAsync([...selected]);
    setSelected(newSelected)
  }

  const handleMoveWishlistItem = async (toWishlistId: string, wishlistItem: WishlistItem) => {
    const newWishlistItem: WishlistItemCreate = {
      product_id: wishlistItem.product_id,
      quantity: wishlistItem.quantity,
      wishlist_id: toWishlistId
    }
    await moveWishlistItemMutation.mutateAsync(newWishlistItem);
    await deleteWishlistItemsMutation.mutateAsync([wishlistItem.id]);

    let selectedIndex = selected.indexOf(wishlistItem.id)
    
    if (selectedIndex > -1) {
      selectedChange(wishlistItem.id);
    }
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected: string[] = wishlistQuery.data.wishlist_items.map((item) => item.id);
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    selectedChange(id);
  }

  const selectedChange = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), 
        selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const wishlistItems = wishlistQuery.data.wishlist_items.map((wishlistItem, index) => {
    const isItemSelected = isSelected(wishlistItem.id);
    return (
      <WishlistItemComponent
        key={wishlistItem.id}
        wishlistItem={wishlistItem}
        itemChecked={isItemSelected}
        handleMoveItem={handleMoveWishlistItem}
        handleEditWishlistItem={handleEditWishlistItem}
        handleCreateWishlistAndMoveItem={handleCreateWishlistAndMoveItem}
        handleCheckItem={(e: React.ChangeEvent<HTMLInputElement>) => handleClick(e, wishlistItem.id)}
      />
    )
  })

  return (
    <div className='container wishlist-page-container'>
      <section>
        <header><h2>{wishlistQuery.data.name}</h2></header>
        <div className='wishlist-actions d-grid gap-2 d-md-flex justify-content-md-end'>
          <button 
            type='button' 
            onClick={handleAddItemsToCart}
            className={classNames('btn', 'btn-primary', {'disabled': !selected.length})}
          >Add items to Cart
          </button>
          <button 
            type='button' 
            onClick={handleRemoveItemsClick}
            className={classNames('btn', 'btn-primary', {'disabled': !selected.length})}
            >Remove Items
          </button>
        </div>
        <div className='filter-btn-wrapper'>
          <FontAwesomeIcon onClick={(e) => {setSortObj(reverseSortObj(sortObj))}}  className='reverse-sort-filter-btn' icon={faArrowRightArrowLeft} />
          <Button
            id='filter-btn'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFilterMenuClick}
          >
            Filter
          </Button>
          <Menu
            id='filterMenu'
            anchorEl={filterBtnAnchorEl}
            open={open}
            onClose={handleFilterMenuClose}
            MenuListProps={{
              'aria-labelledby': 'filter-button',
            }}
            >
            <MenuItem onClick={(e) => {handleFilterMenuClose(); setSortObj({type: 'sortByName'})}}>Sort by name</MenuItem>
            <MenuItem onClick={(e) => {handleFilterMenuClose(); setSortObj({type: 'sortByPrice'})}}>Sort by price</MenuItem>
            <MenuItem onClick={handleFilterMenuClose}>Sort by date added</MenuItem>
          </Menu>
        </div>
        <div className='wishlist-items'>
          <div className='parent wishlist-items-check-all-action'>
            <Checkbox
              checked={wishlistQuery.data.wishlist_items.length > 0 && selected.length === wishlistQuery.data.wishlist_items.length}
              onChange={handleSelectAllClick}
            />
            Select All
          </div>
          <ul>
            {wishlistItems}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default WishlistPage;