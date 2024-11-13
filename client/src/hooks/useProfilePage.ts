import { useEffect, useState } from 'react';
import { getQuestionsByFilter } from '../services/questionService';
import { getUserChallenges } from '../services/challengeService';
import { Question, UserChallenge } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the state and logic of a profile page.
 *
 * @returns userQuestions - the questions that were asked by the user
 */
const useProfilePage = () => {
  const { user } = useUserContext();
  const [userQuestions, setUserQuestions] = useState([] as Question[]);
  const [userChallenges, setUserChallenges] = useState([] as UserChallenge[]);

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
      try {
        const challenges = await getUserChallenges(user.username);
        setUserChallenges(challenges || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching challenges with username:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [user.username]);

  return { user, userQuestions, userChallenges };
};

export default useProfilePage;
