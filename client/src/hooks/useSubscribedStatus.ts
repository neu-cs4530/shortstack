import { useEffect, useState } from 'react';
import { Question } from '../types';
import useUserContext from './useUserContext';
import { subscribeToQuestion } from '../services/questionService';

/**
 * Custom hook to handle subscribing logic for a question.
 * It manages the current user's subscribed status, and handles
 * real-time vote updates via socket events.
 *
 * @param question - The question object for which the subscription is tracked.
 *
 * @returns subscribed - Whether the user is subscribed or not
 * @returns setSubscribed - The function to manually update user's subscribed status
 * @returns handleSubscribed - The function to handle subscribing to a question.
 */

const useSubscribedStatus = ({ question }: { question: Question }) => {
  const { user, socket } = useUserContext();
  const [subscribed, setSubscribed] = useState<boolean>(false);

  /**
   * Function to handle subscribing to a question.
   */
  const handleSubscribe = async () => {
    try {
      if (question._id) {
        await subscribeToQuestion(question._id, user.username);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error subscribing to question:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to get the current subscribed status for the user.
     *
     * @returns Whether the user is subscribed or not.
     */
    const getSubscribedStatus = () =>
      !!user.username && question?.subscribers?.includes(user.username);

    // Set the initial subscribed status
    setSubscribed(getSubscribedStatus());
  }, [question, user.username, socket]);

  return {
    subscribed,
    setSubscribed,
    handleSubscribe,
  };
};

export default useSubscribedStatus;
