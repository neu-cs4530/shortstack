import React from 'react';
import './challengeView.css';
import { UserChallenge } from '../../../../types';

/**
 * Interface representing the props for the Challenge component.
 *
 * challenge - The challenge object containing details about the user’s challenge.
 */
interface ChallengeViewProps {
  challenge: UserChallenge;
}

/**
 * ChallengeView component renders the details of a challenge including its description, reward, and progress.
 * Displays a "Completed" overlay if the challenge is complete and shows the completion percentage.
 *
 * @param challenge - The challenge object containing challenge details.
 */
const ChallengeView = ({ challenge }: ChallengeViewProps) => {
  const isComplete = challenge.progress.length >= challenge.challenge.actionAmount;
  const progressPercentage = Math.min(
    (challenge.progress.length / challenge.challenge.actionAmount) * 100,
    100,
  );

  return (
    <div className='challenge'>
      {isComplete && <div className='challenge-completed-overlay'>Completed</div>}
      <div className='challenge_mid'>
        <div className='challenge_description'>{challenge.challenge.description}</div>
        <div className='progress-bar-container'>
          <div className='progress-bar' style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      <div className='challenge_reward'>
        <div>Reward: {challenge.challenge.reward}</div>
      </div>
      <div className='challenge-percentage'>{progressPercentage}%</div>
    </div>
  );
};

export default ChallengeView;
