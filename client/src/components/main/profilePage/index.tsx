import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './index.css';
import QuestionView from '../questionPage/question';
import useProfilePage from '../../../hooks/useProfilePage';

const ProfilePage = () => {
  const { user, userQuestions, userChallenges } = useProfilePage();
  const [activeTab, setActiveTab] = useState('activity');

  // TODO: Replace with actual data
  const challenges = [
    { description: 'Answer 5 questions', actionAmount: 5, progress: 5, reward: 'Gold Badge' },
    { description: 'Upvote 10 answers', actionAmount: 10, progress: 7, reward: 'Silver Badge' },
    { description: 'Ask 3 questions', actionAmount: 3, progress: 3, reward: 'Bronze Badge' },
  ];

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
            Rewards
          </button>
        </div>
      </div>
      <div className='profile_content'>
        {activeTab === 'activity' && (
          <>
            <h2>Questions Asked: </h2>
            {userQuestions.map((q, idx) => (
              <QuestionView q={q} key={idx} />
            ))}
          </>
        )}
        {activeTab === 'rewards' && (
          <>
            <h2>Challenges:</h2>
            {userChallenges.map((uc, idx) => {
              // TODO : Either add something that says, "No challenges yet (ask a question or answer a question)"
              // or make it so when the user signs up, fetch all challenges and add them to the user
              // TODO : length likely wont work here with the time challenges (update so that it checks the time)
              const isComplete = uc.progress.length >= uc.challenge.actionAmount;
              const progressPercentage = Math.min(
                (uc.progress.length / uc.challenge.actionAmount) * 100,
                100,
              );

              return (
                <div
                  key={idx}
                  className={`challenge ${isComplete ? 'status-complete' : 'status-in-progress'}`}>
                  <p>{uc.challenge.description}</p>
                  <p>
                    Reward: {uc.challenge.reward}{' '}
                    {isComplete && <span className='completed-label'>Completed</span>}
                  </p>
                  <div className='progress-bar-container'>
                    <div className='progress-bar' style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
