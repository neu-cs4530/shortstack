import React from 'react';
import './rewardsView.css';
import { equipReward } from '../../../../services/userService';

/**
 * Interface representing the props for the RewardsView component.
 */
interface RewardsViewProps {
  username: string;
  unlockedFrames: string[];
  unlockedTitles: string[];
  equippedFrame: string;
  equippedTitle: string;
}

/**
 * RewardsView component renders the unlocked frames and titles for a user.
 *
 * @param unlockedFrames - The frames unlocked by the user.
 * @param unlockedTitles - The titles unlocked by the user.
 * @param equippedFrame - The user's currently equipped frame.
 * @param equippedFrame - The user's currently equipped title.
 */
const RewardsView = ({
  username,
  unlockedFrames,
  unlockedTitles,
  equippedFrame,
  equippedTitle,
}: RewardsViewProps) => {
  /**
   * Function to handle changing a user's equipped reward.
   *
   * @param unlockedFrames - The frames unlocked by the user.
   * @param unlockedTitles - The titles unlocked by the user.
   */
  const handleEquip = async (item: string, type: 'frame' | 'title') => {
    try {
      await equipReward(username, item, type);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error((error as Error).message);
    }
  };

  return (
    <div className='rewards_section'>
      <h2>Unlocked Rewards:</h2>
      <div>
        <h3>Frames:</h3>
        {unlockedFrames.length > 0 ? (
          <ul className='reward_list'>
            {unlockedFrames.map((frame, idx) => (
              <li key={idx} className='reward_item'>
                <img src={`/frames/${frame}`} alt={`${frame} frame`} className='frame_image' />
                <button
                  className='equip_button'
                  onClick={() => handleEquip(frame, 'frame')}
                  disabled={frame === equippedFrame}>
                  {frame === equippedFrame ? 'Equipped' : 'Equip'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No frames unlocked yet.</p>
        )}
      </div>
      <div>
        <h3>Titles:</h3>
        {unlockedTitles.length > 0 ? (
          <ul className='reward_list'>
            {unlockedTitles.map((title, idx) => (
              <li key={idx} className='title_item'>
                <span className='title_name'>{title}</span>
                <button
                  className='equip_button'
                  onClick={() => handleEquip(title, 'title')}
                  disabled={title === equippedTitle}>
                  {title === equippedTitle ? 'Equipped' : 'Equip'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No titles unlocked yet.</p>
        )}
      </div>
    </div>
  );
};

export default RewardsView;
