import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './profilePicture.css';

interface ProfilePictureProps {
  user: {
    username: string;
    equippedFrame?: string;
  };
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user }) => (
  <div className='profile-container'>
    <div className='avatar-frame-container'>
      {user.equippedFrame && (
        <img src={`/frames/${user.equippedFrame}`} alt='Profile Frame' className='profile-frame' />
      )}
      <FaUserCircle className='profile-picture' />
    </div>
    <span className='username'>{user.username}</span>
  </div>
);

export default ProfilePicture;
