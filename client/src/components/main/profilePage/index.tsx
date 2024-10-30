import React from 'react';
import useUserContext from '../../../hooks/useUserContext';
import './index.css';

const ProfilePage = () => {
  const { user } = useUserContext();

  return (
    <div className='profile_container'>
      <div className='profile_header'>
        <div className='profile_info'></div>
        <div className='profile_bar'>
          <button>Activity</button>
          <button>Rewards</button>
        </div>
      </div>
      <div className='profile_content'></div>
    </div>
  );
};

export default ProfilePage;
