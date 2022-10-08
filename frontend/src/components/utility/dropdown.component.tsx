import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { userKeys } from '../userQueries';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type UserDropDownOptionsProps = {
  onClickLogout(): Promise<void>
}

const UserOptionsDropDown = (props: UserDropDownOptionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <div className='user-options'>
      <div className='user-options-header' onClick={handleClick}>
        <FontAwesomeIcon className='nav-icon' icon={faUser} />
        <span><FontAwesomeIcon className='nav-icon' icon={faSortDown} /></span>
      </div>
      <Menu 
        id='userOptionsMenu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}><Link to='/wishlists'>Wishlists</Link></MenuItem>
        <MenuItem onClick={handleClose}><Link to='/order-history'>Order History</Link></MenuItem>
        <MenuItem onClick={() => {handleClose(); props.onClickLogout();}}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export { UserOptionsDropDown };