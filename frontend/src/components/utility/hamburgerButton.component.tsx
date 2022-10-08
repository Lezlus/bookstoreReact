import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const HamburgerButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div className={isOpen ? "hamburger-btn-wrapper open": "hamburger-btn-wrapper"} onClick={handleClick}>
        <div className="hamburger-btn"></div>
      </div>
      <div className={isOpen ? 'side-bar-options open' : 'side-bar-options'}>
        <ul>
          <li className='user-options-dropdown'>
            <details>
              <summary>User Options <span><FontAwesomeIcon icon={faCaretRight} /></span></summary>
              <ul>
                <li>
                  <a href='#/'>Wishlists</a>
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
          <li className='side-bar-option'>
            <a href='#/'>All Books</a>
          </li>
          <li className='side-bar-option'>
            <a href='#/'>Action</a>
          </li>
          <li className='side-bar-option'> 
            <a href='#/'>Horror</a>
          </li>
          <li className='side-bar-option'>
            <a href='#/'>Romance</a>
          </li>
        </ul>
      </div>
      <div onClick={handleClick} className={isOpen ? 'side-bar-options-right open' : 'side-bar-options-right'}>

      </div>
    </>
  )
}

export { HamburgerButton }