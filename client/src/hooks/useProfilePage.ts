import { useEffect, useState } from 'react';
import { getQuestionsByFilter } from '../services/questionService';
import { Question } from '../types';
import useUserContext from './useUserContext';
import useUserChallenges from './useUserChallenge';

/**
 * Custom hook for managing the state and logic of a profile page.
 *
 * @returns user - the user that is currently logged in
 * @returns userQuestions - the questions that were asked by the user
 * @returns userChallenges - the challengess the user has earned
 */
const useProfilePage = () => {
  const { user } = useUserContext();
  const [userQuestions, setUserQuestions] = useState([] as Question[]);
  const { challenges: userChallenges } = useUserChallenges(user.username);

  useEffect(() => {
    /**
     * Function to fetch the questions asked by and the UserChallenges of the user.
     */
    const fetchData = async () => {
      try {
        const questions = await getQuestionsByFilter('newest', '', user.username);
        setUserQuestions(questions || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching questions with username:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [user.username]);

  return { user, userQuestions, userChallenges };
};

export default useProfilePage;
