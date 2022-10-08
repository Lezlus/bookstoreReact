import React, { useState } from 'react';
import logo from './logo.svg';
import './css/index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCartShopping, faMagnifyingGlass, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { HamburgerButton } from './components/utility/hamburgerButton.component';
import { Outlet, Link } from 'react-router-dom';
import { UserOptionsDropDown } from './components/utility/dropdown.component';
import { useUser } from './hooks/queries/useUser';
import AuthService from './services/authService';
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from './components/userQueries';

const App = () => {
  const queryClient = useQueryClient();
  const userQuery = useUser();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(!isOpen);
  }

  if (userQuery.isLoading) {
    return <div>Loading</div>
  }

  if (userQuery.isError) {
    return <div>Error</div>
  }

  const onClickLogout = async () => {
    let res = await AuthService.logout();
    console.log(res);
    queryClient.setQueryData(userKeys.user, res);
  }

  return (
    <div className="app">
      <header className="flex main-navbar">
        <div className="top-navbar">
          <nav className='flex'>
            <div className={isOpen ? "hamburger-btn-wrapper open": "hamburger-btn-wrapper"} onClick={handleClick}>
              <div className="hamburger-btn"></div>
            </div>
            <div className={isOpen ? 'side-bar-options open' : 'side-bar-options'}>
              <ul>
                {userQuery.data.isAuthenticated && 
                  <li className='user-options-dropdown'>
                    <details>
                      <summary>User Options <span><FontAwesomeIcon icon={faCaretRight} /></span></summary>
                      <ul>
                        <li>
                          <a href='/wishlists'>Wishlists</a>
                        </li>
                        <li>
                          <Link to='/favorites'>Favorites</Link>
                        </li>
                        <li>
                        <a href='/order-history'>Order History</a>
                        </li>
                      </ul>
                    </details>
                  </li>
                }
                <li className='side-bar-option' onClick={(e) => setIsOpen(!isOpen)}>
                  <Link to='/books/1'>All Books</Link>
                </li>
              </ul>
            </div>
            <div onClick={handleClick} className={isOpen ? 'side-bar-options-right open' : 'side-bar-options-right'}></div>
            <div className='site-title'>
              <Link to='/'><h1>Book Store</h1></Link>
            </div>
            <ul className='auth-user-links'>
              { userQuery.data.isAuthenticated && <li><Link to='/favorites'><FontAwesomeIcon className='nav-icon' icon={faHeart} /></Link></li> }
              { userQuery.data.isAuthenticated && <li><Link to='/cart'><FontAwesomeIcon className='nav-icon' icon={faCartShopping} /></Link></li> }
              { !userQuery.data.isAuthenticated && <li><Link to='/login'>Login</Link></li> }
              { !userQuery.data.isAuthenticated && <li><Link to='/register'>Register</Link></li> }
              { userQuery.data.isAuthenticated && <li className='user-options-container'><UserOptionsDropDown onClickLogout={onClickLogout} /></li> }
            </ul>
            {/* <div className="search-bar-wrapper">
              <input className='search-bar' type='input' />
              <button type='submit'>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div> */}
          </nav>
        </div>
        <div className='bottom-navbar'>
          <nav aria-label='primary navigation'>
            <ul className='flex space-even site-navigator'>
              <li><Link to='/books/1'>All Books</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
      </footer>
    </div>
  ) 
}

export default App;
