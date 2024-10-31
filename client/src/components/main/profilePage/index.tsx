import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './index.css';
import QuestionView from '../questionPage/question';
import useProfilePage from '../../../hooks/useProfilePage';

const ProfilePage = () => {
  const { user, userQuestions } = useProfilePage();

  return (
    <div className='profile_container'>
      <div className='profile_header'>
        <div className='profile_info'>
          <FaUserCircle size='104px' />
          <h3>{user.username}</h3>
        </div>
        <div className='profile_bar'>
          <button className='bar_button active'>Activity</button>
          <button className='bar_button'>Rewards</button>
        </div>
      </div>
      <div className='profile_content'>
        <h2>Questions Asked: </h2>
        {userQuestions.map((q, idx) => (
          <QuestionView q={q} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
