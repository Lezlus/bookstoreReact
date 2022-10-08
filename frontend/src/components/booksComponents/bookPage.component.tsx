import '../../css/index.css';
import '../../css/bookPage.css';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { WishlistCreate, WishlistItemCreate, CartItemCreate } from '../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../hooks/queries/useUser';
import { useBook } from '../../hooks/queries/useBook';
import { useMutation } from '@tanstack/react-query'; 
import { imageUrlFix } from '../utility/imageUrlFix';
import { dateFormatter } from '../utility/dateFormatter';
import WishlistService from '../../services/wishlistService/wishlistService';
import CartService from '../../services/cartService/cartService';

interface WishlistFormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
}

interface WishlistFormElement extends HTMLFormElement {
  readonly elements: WishlistFormElements;
}

interface BookGenreProps {
  genre: string
}

const BookGenre = ({ genre }: BookGenreProps) => {
  const genreClass = genre.replace(' ', '-').toLowerCase();
  return (
    <div className={`genre ${genreClass}`}>
      {genre}
    </div>
  )
}

const BookPage = () => {
  const { slug } = useParams<{slug: string}>();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const userQuery = useUser();
  const bookQuery = useBook(slug!);
  const isLoading = userQuery.isLoading || bookQuery.isLoading;
  const isError = userQuery.isError || bookQuery.isError;

  const createWishlistItemMutation = useMutation((item: WishlistItemCreate) => {
    return WishlistService.createWishlistItem(item);
  })

  const createWishlistMutation = useMutation((wishlist: WishlistCreate) => {
    return WishlistService.createWishlist(wishlist);
  })

  const createCartItemMutation = useMutation((item: CartItemCreate) => {
    return CartService.addItem(item);
  })

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
  }

  const handleAddToWishlist = (item: WishlistItemCreate) => {
    createWishlistItemMutation.mutate(item);
  }

  const handleCreateWishlistAndWishlistItem = async (wishlistName: string) => {
    const bookData = bookQuery.data!;
    const newWishlist: WishlistCreate = {
      name: wishlistName
    }

    const res = await createWishlistMutation.mutateAsync(newWishlist);
    const newWishlistItem: WishlistItemCreate = {
      quantity,
      product_id: bookData.product.id,
      wishlist_id: res.wishlist.id
    }
    await createWishlistItemMutation.mutateAsync(newWishlistItem);
  }

  const handleAddToCart = (item: CartItemCreate) => {
    const userData = userQuery.data!;
    if (userData.isAuthenticated) {
      createCartItemMutation.mutate(item);
    } else {
      navigate('/login')
    }
  }

  const handleSubmit = async (event: React.FormEvent<WishlistFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const elements = event.currentTarget.elements;
    console.log(elements.name.value)
    if (elements.name.value) {
      await handleCreateWishlistAndWishlistItem(elements.name.value);
      handleClose();
    }
    setValidated(true);
  };

  const wishlists = (bookId: number) => {
    if (userQuery.data) {
      if (userQuery.data.user) {
        return userQuery.data.user.wishlists.map(item => 
          <Dropdown.Item  
            onClick={(e) => {handleAddToWishlist({quantity, product_id: bookId, wishlist_id: item.id })}} 
            key={item.id} 
            as='button'>
              {item.name}
          </Dropdown.Item>
          )
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error...</div>
  }

  return (
    <div className='book-detail container'>
      <div className='title-wrapper'>
        <h1>{bookQuery.data.product.title}</h1>
      </div>
      <div className='img-wrapper'>
        <picture>
          <source media="(min-width: 500px)" srcSet={`/images${imageUrlFix(bookQuery.data.product.img_path_lg)}`} />
          <img src={`/images${bookQuery.data.product.img_path_sm}`} alt='Book' /> 
        </picture>
      </div>
      <div className='price-details'>
        <h4>Your Price: <span>${bookQuery.data.product.price}</span></h4>
        <div className='change-quantity-input-wrapper'>
          <TextField
            id='select-quantity'
            select
            label='Quantity'
            value={quantity}
            className='quantity-input'
            size='medium'
            onChange={handleQuantityChange}
          >
            <MenuItem value={'1'}>
              1
            </MenuItem>
            <MenuItem value={'2'}>
              2
            </MenuItem>
            <MenuItem value={'3'}>
              3
            </MenuItem>
            <MenuItem value={'4'}>
              4
            </MenuItem>
            <MenuItem value={'5'}>
              5
            </MenuItem>
          </TextField>
        </div>
      </div>
      <div className='actions'>
        <div className='action-btn-wrapper'>
          <button 
            onClick={(e) => handleAddToCart({quantity, product_id: bookQuery.data.product.id})} 
            type='button' 
            className='btn btn-lg btn-primary add-to-cart-btn'>
              Add to Cart
          </button>
        </div>
        <div className='action-btn-wrapper'>
          <DropdownButton className='add-to-wishlist-dropdown' size='lg' id='dropdown-add-to-wishlist-button' title='Add to Wishlist'>
            {wishlists(bookQuery.data.product.id)}
            <Dropdown.Item as='button' onClick={(e) => handleShow()}  >Create new wishlist</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className='secondary-information'>
        {/* Mobile will be accordions */}
        <div className='mobile'>
          <Accordion defaultActiveKey='0'>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>Description</Accordion.Header>
              <Accordion.Body>
                {bookQuery.data.product.desc}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>Details</Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>Publisher: {bookQuery.data.product.publisher.name}</li>
                  <li>Media: {bookQuery.data.product.media}</li>
                  <li>Themes: {bookQuery.data.product.themes}</li>
                  <li>Age Rating: {bookQuery.data.product.age_rating}</li>
                  <li>Release Date: {dateFormatter(new Date(bookQuery.data.product.release_date))}</li>
                  <li>Page Count: {bookQuery.data.product.page_count}</li>
                  <li>Written language: English</li>
                </ul>
                <div className='book-genre-wrapper'>
                  {bookQuery.data.product.genres.map(genre => 
                    <BookGenre key={genre.id} genre={genre.name} />
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className='desktop'>
          <div className='description-wrapper'>
            <h2>Description</h2>
            <p>
              {bookQuery.data.product.desc}
            </p>
          </div>
          <div className='details'>
            <h2>Details</h2>
            <ul>
              <li>Publisher: {bookQuery.data.product.publisher.name}</li>
              <li>Media: {bookQuery.data.product.media}</li>
              <li>Themes: {bookQuery.data.product.age_rating}</li>
              <li>Age Rating: {bookQuery.data.product.age_rating}</li>
              <li>Release Date: {dateFormatter(new Date(bookQuery.data.product.release_date))}</li>
              <li>Page Count: {bookQuery.data.product.page_count}</li>
              <li>Written language English</li>
            </ul>
            <div className='book-genre-wrapper'>
              {bookQuery.data.product.genres.map(genre => 
                <BookGenre key={genre.id} genre={genre.name} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className='row g-3'>
            <Form.Group className='mb-3' controlId='formCreateWishlist'>
              <Form.Label>Name</Form.Label>
              <Form.Control name='name' type='text' placeholder='Enter a wishlist name' />
            </Form.Group>
            {userQuery.data.isAuthenticated && <Button type='submit' variant="primary">Save Changes</Button>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default BookPage;