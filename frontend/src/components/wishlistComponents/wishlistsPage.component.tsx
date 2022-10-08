import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { v4 as uuidv4 } from 'uuid';
import { dateFormatter } from '../utility/dateFormatter';
import '../../css/wishlistsPage.css'
import { userKeys } from '../userQueries';
import { useUser } from '../../hooks/queries/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WishlistService from '../../services/wishlistService/wishlistService';
import { Wishlist, WishlistCreate, WishlistUpdate } from '../../types';
import { Link } from 'react-router-dom';

interface WishlistProps {
  wishlist: Wishlist
  updateWishlist(wishlist: WishlistUpdate): void
  deleteWishlist(id: string): void
}

interface UpdateWishlistFormElements extends HTMLFormControlsCollection {
  listName: HTMLInputElement
}

interface UpdateWishlistFormElement extends HTMLFormElement {
  readonly elements: UpdateWishlistFormElements
}

const WishlistComponent = (props: WishlistProps) => {
  const {wishlist, updateWishlist, deleteWishlist} = props;
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onDeleteWishlistClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    deleteWishlist(wishlist.id);
  };

  const onUpdateWishlistFormSubmit = (e: React.FormEvent<UpdateWishlistFormElement>) => {
    e.preventDefault();
    const updatedWishlist: WishlistUpdate = { name: e.currentTarget.elements.listName.value, id: wishlist.id }
    updateWishlist(updatedWishlist);
  }

  return (
    <li className='wishlist'>
      <div className='wishlist-details-main'>
        <Link to={`/wishlists/${wishlist.id}`}>{wishlist.name}</Link>
        <p>{wishlist.wishlist_items.length} products</p>
      </div>
      <div className='wishlist-item-details-info'>
        <p>Last updated: {dateFormatter(new Date(wishlist.updated_at))}</p>
      </div>
      <div className='wishlist-item-actions'>
        {!wishlist.is_default && 
          <Dropdown as={ButtonGroup}>
            <Button variant='primary' onClick={handleShow}>Edit list</Button>
            <Dropdown.Toggle split variant='primary' id='dropdown-split-basic' />
            <Dropdown.Menu>
              <Dropdown.Item onClick={onDeleteWishlistClick}>Delete list</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Your List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className='row g-3' noValidate onSubmit={onUpdateWishlistFormSubmit}>
              <Form.Group className='col-12'>
                <Form.Label>Your list name</Form.Label>
                <Form.Control 
                  name='listName' 
                  type='text' 
                  placeholder='Enter list name'
                  defaultValue={wishlist.name}
                />
              </Form.Group>
              <Button 
              variant='primary' 
              type='submit' 
              onClick={(e:React.MouseEvent<HTMLButtonElement>) => { handleClose() }} 
              >Save
              </Button>
              <Button variant='secondary' onClick={handleClose} type='button'>Cancel</Button>
            </Form>
          </Modal.Body>
      </Modal>
    </li>
  )
}

const WishListsPage = () => {
  const userQuery = useUser();
  const queryClient = useQueryClient();
  // const [wishlists, setWishlists] = useState<WishListType[]>(dummyWishlists)
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateWishlistMutation = useMutation((dataToUpdateWishlist: WishlistUpdate) => {
    return WishlistService.updateWishlist(dataToUpdateWishlist)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.user);
    }
  })

  const deleteWishlistMutation = useMutation((id: string) => {
    return WishlistService.deleteWishlist({id});
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.user)
    }
  })

  const createWishlistMutation = useMutation((dataToCreateWishlist: WishlistCreate) => {
    return WishlistService.createWishlist(dataToCreateWishlist);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.user);
    }
  })

  if (userQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (userQuery.isError) {
    return <div>Error...</div>
  }


  const updateWishlist = (updatedWishlist: WishlistUpdate) => {
    updateWishlistMutation.mutate(updatedWishlist);
  }

  const deleteWishlist = (id: string) => {
    deleteWishlistMutation.mutate(id);
  }

  const createWishlist = (e: React.FormEvent<UpdateWishlistFormElement>) => {
    e.preventDefault();
    if (userQuery.data.user) {
      const newWishlist: WishlistCreate = {
        name: e.currentTarget.elements.listName.value,
      }
      createWishlistMutation.mutate(newWishlist);
    }
  }

  const wishlistsList = () => {
    if (userQuery.data.user) {
      return userQuery.data.user.wishlists.map((wishlist) => 
        <WishlistComponent
          key={wishlist.id} 
          wishlist={wishlist} 
          deleteWishlist={deleteWishlist}
          updateWishlist={updateWishlist}
        />
      )
    }
  }

  return (
    <div className='container wishlists-container'>
      <section>
        <header><h2>My Wishlists</h2></header>
        <div className='create-wishlist-btn d-grid d-sm-block'>
          <button type='button' className='btn btn-primary' onClick={handleShow}>Create New Wishlist</button>
        </div>
        <div className='wishlist-items'>
          <ul>
            {wishlistsList()}
          </ul>
        </div>
      </section>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Your List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className='row g-3' noValidate onSubmit={createWishlist}>
              <Form.Group className='col-12'>
                <Form.Label>Your list name</Form.Label>
                <Form.Control 
                  name='listName' 
                  type='text' 
                  placeholder='Enter list name'
                />
              </Form.Group>
              <Button 
              variant='primary' 
              type='submit' 
              onClick={(e:React.MouseEvent<HTMLButtonElement>) => { handleClose() }} 
              >Create
              </Button>
              <Button variant='secondary' onClick={handleClose} type='button'>Cancel</Button>
            </Form>
          </Modal.Body>
      </Modal>
    </div>
  )
}

export default WishListsPage