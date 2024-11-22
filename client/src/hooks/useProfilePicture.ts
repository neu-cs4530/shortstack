import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { getUserFrame } from '../services/userService';

/**
 * Custom hook for managing the state and logic of a profile picture & frame.
 * @param username - the username of the user with the profile picture.
 *
 * @returns frame - the filename of the frame equipped by the user.
 */
const useProfilePicture = (username: string) => {
  const [frame, setFrame] = useState<string>();
  const { user } = useUserContext();

  useEffect(() => {
    /**
     * Function to fetch the profile frame of the user with the username.
     */
    const fetchFrame = async () => {
      if (username === user.username) {
        setFrame(user.equippedFrame);
      }

      try {
        const userFrame = await getUserFrame(username);
        setFrame(userFrame);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching frame with username:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchFrame().catch(e => console.log(e));
  }, [user, username]);

  return { frame };
};

export default useProfilePicture;
