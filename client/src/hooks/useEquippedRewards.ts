import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { getUserEquippedRewards } from '../services/userService';

/**
 * Custom hook for managing the state and logic of a user's equipped rewards.
 * @param username - the username of the user whose equipped rewards we are storing.
 *
 * @returns frame - the filename of the frame equipped by the user.
 * @returns title - the title reward equipped by the user.
 */
const useEquippedRewards = (username: string) => {
  const [frame, setFrame] = useState<string>();
  const [title, setTitle] = useState<string>();
  const { user } = useUserContext();

  useEffect(() => {
    /**
     * Function to fetch the profile frame of the user with the username.
     */
    const fetchEquippedRewards = async () => {
      if (username === user.username) {
        setFrame(user.equippedFrame);
        setTitle(user.equippedTitle);
      }

      try {
        const userEquippedRewards = await getUserEquippedRewards(username);
        setFrame(userEquippedRewards.equippedFrame);
        setTitle(userEquippedRewards.equippedTitle);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching equipped rewards with username:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchEquippedRewards().catch(e => console.log(e));
  }, [user, username]);

  return { frame, title };
};

export default useEquippedRewards;
