import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { communityID } = useParams<{ communityID: string }>();
  const [titleText, setTitleText] = useState<string>('Community');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // TODO : Fetch the real community data.
    const communityData = MOCK_COMMUNITIES.find(
      community => community._id === String(communityID).trim(),
    );

    if (communityData) {
      setTitleText(communityData.name);
      setQuestions(communityData.questions || []);
      setPolls(communityData.polls || []);
      setArticles(communityData.articles || []);
    }
  }, [communityID]);

  return { titleText, questions, polls, articles };
};

export default useCommunityPage;
