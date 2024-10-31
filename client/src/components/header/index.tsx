import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import useHeader from '../../hooks/useHeader';
import './index.css';

/**
 * Header component that renders the main title, a search bar and a notifications button.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter. The notifications button allows the user to navigate to their
 * notifications page.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div id='header' className='header'>
      <div className='headerContents'>
        <div className='title'>Fake Stack Overflow</div>
        <div className='headerButtons'>
          <input
            id='searchBar'
            placeholder='Search ...'
            type='text'
            value={val}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className='notifications_btn' onClick={handleNotifications}>
            Notifications
          </button>
          <button className='profile_btn' onClick={handleProfile}>
            <FaUserCircle size='32px' className='profile_icon' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
