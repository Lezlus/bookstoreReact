import React, { useState } from 'react';
import '../../css/booksPage.css'
import '../../css/index.scss'
import { FormControlLabel, FormGroup, Checkbox, FormControl,
  RadioGroup, Radio} from '@mui/material';
import CartService from '../../services/cartService/cartService';
import FavoriteService from '../../services/favoriteService/favoriteService';

import { Product } from '../../types/product';
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from '../utility/pagination';
import { useParams, useLocation, useNavigate, Navigate, useSearchParams, Link } from "react-router-dom";
import { usePaginatedBooksQuery, useAllBooksQuery } from '../../hooks/queries/useBooks';
import { useUser } from '../../hooks/queries/useUser';
import { userKeys } from '../userQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import classnames from 'classnames';
import { ProductSortType, ProductGenreType, 
  ProductPublisherType, CartItemCreate,
  FavoriteItemDelete, FavoriteItemCreate, SortRequest} from '../../types';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MenuItem from '@mui/material/MenuItem';
import Dropdown from 'react-bootstrap/Dropdown';
import { v4 as uuidv4 } from 'uuid';

const PAGE_SIZE: number = 20;
const GENRES = ['Fantasy', 'Romance', 'Action', 'Horror', 
  'Drama', 'Comedy', 'Science Fiction', 'Mystery', 'Documentary', 'Erotica']
const PUBLISHERS = ['KODANSHA COMICS', 'SEVEN SEAS', 'VIZ BOOKS', 'DENPA',
  'VERTICAL', 'DARK HORSE MANGA', 'SQUARE ENIX MANGA', 'YEN PRESS', 'ONE PEACE', 
  'GHOST SHIP', 'SUBLIME', 'J-NOVEL CLUB', 'SHOJO BEAT', 'FAKKU']

type SortTypeMap = {
  [sortType in SortRequest]: string;
}



const sortMap: SortTypeMap = {
  'relevance:asc': 'Sort by relevance',
  'relevance:desc': 'Sort by relevance',
  'price:asc': 'Sort by price, low to high',
  'price:desc': 'Sort by price, high to low',
  'title:asc': 'Sort by name, A-Z',
  'title:desc': 'Sort by name, Z-A',
  'release_date:asc': 'Release Date, New to Old',
  'release_date:desc': 'Release Date, Old to New'
}

function checkBookInFavorites(bookIds: number[], bookId: number): boolean {
  return bookIds.some(item => item === bookId);
}


interface BookItemProps {
  book: Product;
  isAuthenticated: boolean;
  bookInFavorites: boolean;
  handleRemoveFavoriteItem(productId: number): void;
  handleAddFavoriteItem(productId: number): void;
  handleAddItemToCart(productId: number, quantity: number): void;
}

const emptyGenres: string[] = [];


const BookItem = (props: BookItemProps) => {
  const { book, bookInFavorites, handleAddItemToCart, 
    handleRemoveFavoriteItem, isAuthenticated,
    handleAddFavoriteItem } = props;
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
  }


  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      handleAddItemToCart(book.id, quantity);
    }
  }

  const handleFavoriteIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      if (bookInFavorites) {
        handleRemoveFavoriteItem(book.id);
      } else {
        handleAddFavoriteItem(book.id);
      }
    }
  }

  return (
    <div className='book-container'>
      <div className='add-to-favorites-icon-wrapper' onClick={handleFavoriteIconClick}>
        <FontAwesomeIcon className={classnames('add-to-favorites-icon', {selected: bookInFavorites})} icon={faHeart} />
      </div>
      <div className={classnames('book-img text-center', {erotica: book.is_erotica})}>
        <Link to={`/${book.slug}`}>
          <img
            className='img-fluid'
            alt={book.title}
            src={`/images/${book.img_path_sm}`}
          />
        </Link>
      </div>
      <div className='book-data'>
        <div className='book-title-wrapper'>
          <h2>
            <a href='/#'>
              <span>
                {book.title}
              </span>
            </a>
          </h2>
        </div>
        <p>Price: <span>${book.price}</span></p>
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
        <button onClick={handleAddToCartClick} type='button' className='btn'>Add to Cart</button>
      </div>
    </div>
  )
} 

const BooksPage = () => {
  const { page } = useParams<{page: string}>();
  // const [ searchParams ] = useSearchParams();
  // const genreQuery = searchParams.get('genre');
  // User might not click on specific genre link, must check for null 
  // const genres = genreQuery ? [genreQuery] : emptyGenres;
  // console.log(genres);
  // const genreQuery = searchParams.get('genre') ? [searchParams.get('genre')] : emptyGenres;
  // const location = useLocation();
  // const locationState = location.state ? location.state as LocationState : defaultLocationState;

  const queryClient = useQueryClient();

  const [sortObj, setSortObj] = useState<ProductSortType>({type: 'relevance:asc'});
  const [genreFilters, setGenreFilters] = useState<string[]>([]);
  const [publisherFilters, setPublisherFilters] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  
  const firstPageIndex = (parseInt(page!) - 1) * PAGE_SIZE;
  const lastPageIndex = firstPageIndex + PAGE_SIZE;

  const paginatedBooksQuery = usePaginatedBooksQuery(page!, firstPageIndex, 
    lastPageIndex, genreFilters, publisherFilters, sortObj, priceFilter);
  const userQuery = useUser();


  const addItemToCartMutation = useMutation((item: CartItemCreate) => {
    return CartService.addItem(item)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.user)
    }
  })

  const removeFavoriteItem = useMutation((item: FavoriteItemDelete) => {
    return FavoriteService.deleteItem(item);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.user)
    }
  })

  const addFavoriteItem = useMutation((item: FavoriteItemCreate) => {
    return FavoriteService.addItem(item);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.user)
    }
  })

  const handleRemoveFavoriteItem = (product_id: number) => {
    const userData = userQuery.data!.user!;
    let favorite_ids: string[] = userData.favorite.favorite_items
      .filter(item => item.product_id === product_id)
      .map(item => item.id);
    removeFavoriteItem.mutate({id: favorite_ids[0]});
  }

  const handleAddFavoriteItem = (product_id: number) => {
    const userData = userQuery.data!.user!;
    addFavoriteItem.mutate({product_id, favorite_id: userData.favorite.id})
  }

  const handleAddItemToCart = (product_id: number, quantity: number) => {
    addItemToCartMutation.mutate({product_id, quantity});
  }

  const handleClickGenreCheckbox = (genre: string) => {
    const selectedIndex = genreFilters.indexOf(genre);
    let newGenres: string[] = [];

    if (selectedIndex === -1) {
      newGenres = newGenres.concat(genreFilters, genre)
    } else if (selectedIndex === 0) {
      newGenres = newGenres.concat(genreFilters.slice(1))
    } else if (selectedIndex === genreFilters.length - 1) {
      newGenres = newGenres.concat(genreFilters.slice(0, -1));
    } else if (selectedIndex > 0) {
      newGenres = newGenres.concat(genreFilters.slice(0, selectedIndex), 
      genreFilters.slice(selectedIndex + 1));
    }

    setGenreFilters(newGenres);
  }

  const handleClickPublisherCheckbox = (publisher: string) => {
    const selectedIndex = publisherFilters.indexOf(publisher);
    let newPublishers: string[] = [];

    if (selectedIndex === -1) {
      newPublishers = newPublishers.concat(publisherFilters, publisher)
    } else if (selectedIndex === 0) {
      newPublishers = newPublishers.concat(publisherFilters.slice(1))
    } else if (selectedIndex === publisherFilters.length - 1) {
      newPublishers = newPublishers.concat(publisherFilters.slice(0, -1));
    } else if (selectedIndex > 0) {
      newPublishers = newPublishers.concat(publisherFilters.slice(0, selectedIndex), 
      publisherFilters.slice(selectedIndex + 1));
    }

    setPublisherFilters(newPublishers);
  }

  const bookItemInFavorites = (bookId: number) => {
    if (userQuery.data) {
      if (!userQuery.data.user) {
        return false
      }
      let bookIds: number[] = userQuery.data.user.favorite.favorite_items.map(item => item.product_id);
      return checkBookInFavorites(bookIds, bookId)
    }
    return false
  }

  const genresFilterCheckBoxes = GENRES.map((genre) => 
    <FormControlLabel
      key={uuidv4()}
      control={
        <Checkbox
        onClick={() => handleClickGenreCheckbox(genre)}
        checked={genreFilters.indexOf(genre) !== -1}
        />}
        label={genre}
    />
  )

  const publishersFilterCheckboxes = PUBLISHERS.map((publisher) => 
    <FormControlLabel
      key={uuidv4()}
      control={
        <Checkbox
        onClick={() => handleClickPublisherCheckbox(publisher)}
        checked={publisherFilters.indexOf(publisher) !== -1}
        />}
      label={publisher}
    />
  )

  const isLoading = paginatedBooksQuery.isLoading || userQuery.isLoading;
  const isError = paginatedBooksQuery.isError || userQuery.isError;

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  if (paginatedBooksQuery.data.count < PAGE_SIZE && page! !== '1') {
    return <Navigate to='/books/1' />
  }

  return (
    <div className='books-page-container books-page-container-grid container-fluid'>
      <div className='sort-button-wrapper d-flex flex-row-reverse'>
        <Dropdown>
          <Dropdown.Toggle variant='primary' id='dropdown-sort'>
            {sortMap[sortObj.type]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {setSortObj({type: 'relevance:asc'})}} active={sortObj.type === 'relevance:asc'} as='button'>Sort by relevance</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSortObj({type: 'price:asc'})}} active={sortObj.type === 'price:asc'} as='button'>Sort by price, low to high</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSortObj({type: 'price:desc'})}} active={sortObj.type === 'price:desc'} as='button'>Sort by price, high to low</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSortObj({type: 'title:asc'})}} active={sortObj.type === 'title:asc'} as='button'>Sort by Name, A-Z</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSortObj({type: 'title:desc'})}} active={sortObj.type === 'title:desc'} as='button'>Sort by Name, Z-A</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSortObj({type: 'release_date:asc'})}} active={sortObj.type === 'release_date:asc'} as='button'>Release Date, New to Old</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSortObj({type: 'release_date:desc'})}} active={sortObj.type === 'release_date:desc'} as='button'>Release Date, Old to New</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='row'>
        <div className='filters-sidebar col-md-4'>
          <div className='filters-sidebar-dropdown'>
            <details>
              <summary className='filter-btn-container'>
                <div className='filter-btn-wrapper'>
                  <button type='button' className='btn btn-lg'>Filters</button>
                </div>
              </summary>
              <ul className='filters'>
                <li className='filter'>
                  <Accordion>
                    <AccordionSummary
                      id='filter-genre-panel'
                    >
                      Genres
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {genresFilterCheckBoxes}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                </li>
                <li className='filter'>
                  <Accordion>
                    <AccordionSummary
                      id='filter-publisher-panel'
                    >
                      Publishers
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {publishersFilterCheckboxes}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                </li>
                <li className='filter'>
                  <Accordion>
                    <AccordionSummary
                      id='filter-price-panel'
                    >
                      Price
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby='price-range-buttons-group-label'
                          value={priceFilter}
                          name='price-range-radio-buttons-group'
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPriceFilter((e.target as HTMLInputElement).value)}}
                        >
                          <FormControlLabel value='all' control={<Radio />} label='all'/>
                          <FormControlLabel value='<5' control={<Radio />} label='Under $5'/>
                          <FormControlLabel value='5-10' control={<Radio />} label='$5 - $10'/>
                          <FormControlLabel value='10-25' control={<Radio />} label='$10 - $25'/>
                          <FormControlLabel value='25<' control={<Radio />} label='$25+'/>
                        </RadioGroup>
                      </FormControl>
                    </AccordionDetails>
                  </Accordion>
                </li>
              </ul>
            </details>
          </div>
          <div className='filters-sidebar-desktop'>
            <div className='filters-sidebar-container'>
              <h2>Filters</h2>
              <div className='sidebar-filter'>
                <h3>Genre</h3>
                <FormGroup>
                  {genresFilterCheckBoxes}
                </FormGroup>
                
              </div>
              <div className='sidebar-filter'>
                <h3>Publisher</h3>
                <FormGroup>
                  {publishersFilterCheckboxes}
                </FormGroup>
              </div>
              <div className='sidebar-filter'>
                <h3>Price</h3>
                <FormControl>
                  <RadioGroup
                    aria-labelledby='price-range-buttons-group-label'
                    value={priceFilter}
                    name='price-range-radio-buttons-group'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPriceFilter((e.target as HTMLInputElement).value)}}
                  >
                    <FormControlLabel value='all' control={<Radio />} label='all'/>
                    <FormControlLabel value='<5' control={<Radio />} label='Under $5'/>
                    <FormControlLabel value='5-10' control={<Radio />} label='$5 - $10'/>
                    <FormControlLabel value='10-25' control={<Radio />} label='$10 - $25'/>
                    <FormControlLabel value='25<' control={<Radio />} label='$25+'/>
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className='books books-grid col-md-8'>
          {paginatedBooksQuery.data.products.map(item => 
            <BookItem 
              key={item.id} 
              book={item} 
              isAuthenticated={userQuery.data.isAuthenticated}
              bookInFavorites={bookItemInFavorites(item.id)}
              handleAddItemToCart={handleAddItemToCart}
              handleAddFavoriteItem={handleAddFavoriteItem}
              handleRemoveFavoriteItem={handleRemoveFavoriteItem}
            />
          )}
        </div>
      </div>
      <div className='pagination-bottom'>
          <div className='pagination-wrapper'>
            <Pagination
              className='pagination-bar'
              currentPage={parseInt(page!)}
              totalCount={paginatedBooksQuery.data.count}
              pageSize={PAGE_SIZE}
              siblingCount={1}
            />
          </div>
      </div>
    </div>
  )
}

export default BooksPage;