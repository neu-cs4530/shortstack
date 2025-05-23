import { useState } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';
import QuestionView from '../questionPage/question';
import useProfilePage from '../../../hooks/useProfilePage';
import ChallengeView from './challengePage/challengeView';
import RewardsView from './rewardsPage/rewardsView';
import ProfilePicture from '../profilePicture';

const ProfilePage = () => {
  const { tab } = useParams();
  const { user, userQuestions, userChallenges } = useProfilePage();
  const [activeTab, setActiveTab] = useState(tab);

  return (
    <div className='profile_container'>
      <div className='profile_header'>
        <div className='profile_info'>
          <div className='profile-pic-container'>
            <ProfilePicture equippedFrame={user.equippedFrame} />
          </div>
          <h3>{user.username}</h3>
          {user.equippedTitle && <p className='equipped-title'>{user.equippedTitle}</p>}
          Points: {user.totalPoints}
        </div>
        <div className='profile_bar'>
          <button
            className={`bar_button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}>
            Activity
          </button>
          <button
            className={`bar_button ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}>
            Challenges
          </button>
          <button
            className={`bar_button ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}>
            Rewards
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
        {activeTab === 'challenges' && (
          <>
            <h2>Challenges:</h2>
            {userChallenges.length > 0 ? (
              userChallenges.map((uc, idx) => <ChallengeView challenge={uc} key={idx} />)
            ) : (
              <p>No challenges yet. Start by asking or answering a question!</p>
            )}
          </>
        )}
        {activeTab === 'rewards' && (
          <RewardsView
            username={user.username}
            unlockedFrames={user.unlockedFrames}
            unlockedTitles={user.unlockedTitles}
            equippedFrame={user.equippedFrame}
            equippedTitle={user.equippedTitle}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
