import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import useUserContext from '../../../hooks/useUserContext';
import './index.css';
import { Question } from '../../../types';
import QuestionView from '../questionPage/question';
import { getQuestionsByFilter } from '../../../services/questionService';

const ProfilePage = () => {
  const { user } = useUserContext();
  const [userQuestions, setUserQuestions] = useState([] as Question[]);

  useEffect(() => {
    /**
     * Function to fetch the questions asked by this user.
     */
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter('newest', '', user.username);
        setUserQuestions(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching questions with username:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [user.username]);

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
