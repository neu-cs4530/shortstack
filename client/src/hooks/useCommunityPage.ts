import { useEffect, useState } from 'react';
import { Question, Poll, Article } from '../types';
import MOCK_COMMUNITIES from '../components/main/communityPage/mockCommunityData';

/**
 * Custom hook for managing the community page state, fetching community data, and handling real-time updates.
 *
 * @returns titleText - The title of the community page
 * @returns questions - List of questions in the community
 * @returns polls - List of polls in the community
 */
const useCommunityPage = () => {
  const [titleText, setTitleText] = useState<string>('Community');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Directly set mock data for testing
    setTitleText(MOCK_COMMUNITIES[0].name);
    setQuestions(MOCK_COMMUNITIES[0].questions || []);
    setPolls(MOCK_COMMUNITIES[0].polls || []);
    setArticles(MOCK_COMMUNITIES[0].articles || []);
  }, []);

  return { titleText, questions, polls, articles };
};

export default useCommunityPage;
