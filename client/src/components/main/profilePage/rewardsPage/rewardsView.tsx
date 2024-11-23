import React from 'react';
import './rewardsView.css';
import { equipReward } from '../../../../services/userService';
import { FRAMES } from '../../../../types';

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
 * @param username - The user's username.
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
   * @param item - The string representation of the reward to equip.
   * @param type - The type of reward, either a frame or a title.
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
      <h2>Frames:</h2>
      <div>
        <ul className='reward_list'>
          {FRAMES.map((frame, idx) => (
            <li key={idx} className='reward_item'>
              <img
                className={
                  unlockedFrames.includes(frame.name)
                    ? 'frame_image-unlocked'
                    : 'frame_image-locked'
                }
                src={`/frames/${frame.name}`}
                alt={`${frame.name} frame`}
              />
              {unlockedFrames.includes(frame.name) ? (
                <button
                  className='equip_button'
                  onClick={() => handleEquip(frame.name, 'frame')}
                  disabled={frame.name === equippedFrame}>
                  {frame.name === equippedFrame ? 'Equipped' : 'Equip'}
                </button>
              ) : (
                <div className='locked_text'>Points: {frame.pointsNeeded}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <h2>Titles:</h2>
      <div>
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
