import { useState, useEffect } from 'react';
import { UserChallenge } from '../types';
import { getUserChallenges } from '../services/challengeService';
import useUserContext from './useUserContext';

/**
 * Custom hook to fetch and manage the list of UserChallenges assigned to the user.
 *
 * @param username - The username of the user to fetch challenges for.
 * @returns challenges - The list of user challenges.
 */
const useUserChallenges = (username: string) => {
  const { socket } = useUserContext();
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

  useEffect(() => {
    /**
     * Function to add progress to upvote challenges if an upvote is received for the current user.
     *
     * (NOTE: challenges are already updated on the server side, but if the user is currently on the
     * profile/challenges page, this allows them to see a visual change. This does not override/duplicate
     * the progress added server side.)
     *
     * @param updatedUser - The username of the user who received an upvote.
     */
    const handleUpvoteReceived = async (updatedUser: string) => {
      if (updatedUser === username) {
        const updatedChallenges = challenges.map(c => {
          if (c.challenge.challengeType === 'upvote') {
            const updatedChallenge: UserChallenge = { ...c, progress: [...c.progress, new Date()] };
            return updatedChallenge;
          }
          return c;
        });

        setChallenges(updatedChallenges);
      }
    };

    socket.on('upvoteReceived', handleUpvoteReceived);

    return () => {
      socket.off('upvoteReceived', handleUpvoteReceived);
    };
  }, [challenges, socket, username]);

  return { challenges };
};

export default useUserChallenges;
