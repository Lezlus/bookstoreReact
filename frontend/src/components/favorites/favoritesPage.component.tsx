import '../../css/booksPage.css';
import '../../css/favoritesPage.css';
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useUser } from '../../hooks/queries/useUser';
import FavoriteService from '../../services/favoriteService/favoriteService';
import { FavoriteItem, FavoriteItemDelete, CartItemCreate } from '../../types';
import { useFavorite } from '../../hooks/queries/useFavorite';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CartService from '../../services/cartService/cartService';
import { favoriteKeys } from './queries';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

interface FavoriteItemProps {
  favoriteItem: FavoriteItem;
  handleRemoveItem(item: FavoriteItem): void;
  handleAddItemToCart(item: FavoriteItem, quantity: number): void
}

const FavoriteItemComponent = (props: FavoriteItemProps) => {
  const { favoriteItem, handleRemoveItem, handleAddItemToCart } = props;
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
  }

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleAddItemToCart(favoriteItem, quantity);
  }

  const handleRemoveFavoriteItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleRemoveItem(favoriteItem);
  }

  return (
    <div className='book-container'>
      <div className='add-to-favorites-icon-wrapper' onClick={handleRemoveFavoriteItemClick} >
        <FontAwesomeIcon className='add-to-favorites-icon selected' icon={faHeart} />
      </div>
      <div className='book-img text-center'>
        <img
          className='img-fluid'
          alt='somebook'
          src={`images/${favoriteItem.product.img_path_sm}`}
          />
      </div>
      <div className='book-data'>
        <div className='book-title-wrapper'>
          <h2>
            <a href='/#'>
              <span>
                {favoriteItem.product.title}
              </span>
            </a>
          </h2>
        </div>
        <p>Price: <span>${favoriteItem.product.price}</span></p>
      </div>
      <div className='book-actions'>
        <TextField
          id='select-quantity'
          select
          label='Quantity'
          value={`${quantity}`}
          className='quantity-input'
          size='small'
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
        <button type='button' className='btn' onClick={handleAddToCartClick}>Add to Cart</button>
      </div>
    </div>
  )
}

const FavoritesPage = () => {
  const userQuery = useUser();
  const queryClient = useQueryClient();

  const userId = userQuery.data?.user?.id;
  const userData = userQuery.data!.user!;

  const favoriteQuery = useFavorite(userData!.favorite.id, userId);

  const isLoading = userQuery.isLoading || favoriteQuery.isLoading;
  const isError = userQuery.isError || favoriteQuery.isError;

  const addItemToCartMutation = useMutation((item: CartItemCreate) => {
    return CartService.addItem(item);
  })

  const removeFavoriteItem = useMutation((item: FavoriteItemDelete) => {
    return FavoriteService.deleteItem(item)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(favoriteKeys.detail(userData!.favorite.id))
    }
  })

  const handleRemoveItem = (item: FavoriteItem) => {
    removeFavoriteItem.mutate({id: item.id})
  }

  const handleAddItemToCart = (item: FavoriteItem, quantity: number) => {
    addItemToCartMutation.mutate({quantity, product_id: item.product_id})
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  return (
    <div className="container favorite-books books books-grid">
      {favoriteQuery.data.favorite.favorite_items.map(item => 
        <FavoriteItemComponent 
          favoriteItem={item}
          handleAddItemToCart={handleAddItemToCart}
          handleRemoveItem={handleRemoveItem}
          key={item.id} 
        />
        )}
    </div>
  )
}

export default FavoritesPage