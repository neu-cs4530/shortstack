import { useEffect, useState } from 'react';
import { Question } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook to handle subscribing logic for a question.
 * It manages the current user's subscribed status, and handles
 * real-time vote updates via socket events.
 *
 * @param question - The question object for which the subscription is tracked.
 *
 * @returns subscribed - Whether the user is subscribed or not
 * @returns setSubscribed - The function to manually update user's subscribed status
 */

const useSubscribedStatus = ({ question }: { question: Question }) => {
  const { user, socket } = useUserContext();
  const [subscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Function to get the current subscribed status for the user.
     *
     * @returns Whether the user is subscribed or not.
     */
    const getSubscribedStatus = () => {
      if (user.username && question?.subscribers?.includes(user.username)) {
        return true;
      }
      return false;
    };

    // Set the initial subscribed status
    setSubscribed(getSubscribedStatus());
  }, [question, user.username, socket]);

  return {
    subscribed,
    setSubscribed,
  };
};

export default useSubscribedStatus;
