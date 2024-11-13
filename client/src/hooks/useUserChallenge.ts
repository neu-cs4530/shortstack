import { useState, useEffect } from 'react';
import { UserChallenge } from '../types';
import { getUserChallenges } from '../services/challengeService';

/**
 * Custom hook to fetch and manage the list of UserChallenges assigned to the user.
 *
 * @param username - The username of the user to fetch challenges for.
 * @returns challenges - The list of user challenges.
 */
const useUserChallenges = (username: string) => {
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challengeData = await getUserChallenges(username);
        setChallenges(challengeData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user challenges:', error);
      }
    };

    fetchChallenges();
  }, [username]);

  return { challenges };
};

export default useUserChallenges;
