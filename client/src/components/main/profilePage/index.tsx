import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './index.css';
import QuestionView from '../questionPage/question';
import useProfilePage from '../../../hooks/useProfilePage';
import ChallengeView from '../challengePage/challengeView';

const ProfilePage = () => {
  const { user, userQuestions, userChallenges } = useProfilePage();
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <div className='profile_container'>
      <div className='profile_header'>
        <div className='profile_info'>
          <div className='profile-container'>
            <FaUserCircle size='104px' className='profile-picture' />
            {user.equippedFrame && (
              <img
                src={`/frames/${user.equippedFrame}`}
                alt='Profile Frame'
                className='profile-frame'
              />
            )}
          </div>
          <h3>{user.username}</h3>
        </div>
        <div className='profile_bar'>
          <button
            className={`bar_button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}>
            Activity
          </button>
          <button
            className={`bar_button ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}>
            Challenges/Rewards
          </button>
        </div>
      </div>
      <div className='profile_content'>
        {activeTab === 'activity' && (
          <>
            <h2>Questions Asked:</h2>
            {userQuestions.map((q, idx) => (
              <QuestionView q={q} key={idx} />
            ))}
          </>
        )}
        {activeTab === 'rewards' && (
          <>
            <h2>Challenges:</h2>
            {userChallenges.length > 0 ? (
              userChallenges.map((uc, idx) => <ChallengeView challenge={uc} key={idx} />)
            ) : (
              <p>No challenges yet. Start by asking or answering a question!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
