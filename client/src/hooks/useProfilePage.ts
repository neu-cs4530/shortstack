import { useEffect, useState } from 'react';
import { getQuestionsByFilter } from '../services/questionService';
import { Question } from '../types';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the state and logic of an answer submission form.
 *
 * @returns userQuestions - the questions that were asked by the user
 */
const useProfilePage = () => {
  const { user } = useUserContext();
  const [userQuestions, setUserQuestions] = useState([] as Question[]);

  useEffect(() => {
    /**
     * Function to fetch the questions asked by this user.
     */
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter('newest', '', user.username);
        setUserQuestions(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching questions with username:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [user.username]);

  return { user, userQuestions };
};

export default useProfilePage;
