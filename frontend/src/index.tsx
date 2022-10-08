import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './components/home.component';
import BooksPage from './components/booksComponents/allBooksPage.component';
import FavoritesPage from './components/favorites/favoritesPage.component';
import OrderHistoryPage from './components/orderHistory/orderHistoryPage';
import CartPage from './components/cart/cartPage.component';
import WishListsPage from './components/wishlistComponents/wishlistsPage.component';
import WishListPage from './components/wishlistComponents/wishlistPage.component';
import LoginPage from './components/authComponents/login.components';
import BookPage from './components/booksComponents/bookPage.component';
import RegisterPage from './components/authComponents/register.component';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { bookKeys } from './components/booksComponents/queries';

const queryClient = new QueryClient();
queryClient.setQueryDefaults(bookKeys.all, {staleTime: Infinity});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path=':slug' element={<BookPage />} />
            <Route path='books/:page' element={<BooksPage />} />
            <Route path='favorites' element={<FavoritesPage />} />
            <Route path='order-history' element={<OrderHistoryPage />} />
            <Route path='cart' element={<CartPage />} />
            <Route path='wishlists' element={<WishListsPage />} />
            <Route path='wishlists/:wishlistId' element={<WishListPage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
