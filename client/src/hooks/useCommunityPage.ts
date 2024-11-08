import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question, Poll, Article } from '../types';
import { getCommunityDetails } from '../services/communityService';

/**
 * Custom hook for managing the community page state, fetching community data, and handling real-time updates.
 *
 * @returns titleText - The title of the community page
 * @returns questions - List of questions in the community
 * @returns polls - List of polls in the community
 * @returns articles - List of articles in the community
 */
const useCommunityPage = () => {
  const { communityID } = useParams<{ communityID: string }>();
  const [titleText, setTitleText] = useState<string>('Community');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        if (communityID) {
          const communityData = await getCommunityDetails(communityID);
          setTitleText(communityData.name);
          setQuestions(communityData.questions || []);
          setPolls(communityData.polls || []);
          setArticles(communityData.articles || []);
        }
      } catch (error) {
        throw new Error('Failed to fetch community data');
      }
    };
    fetchCommunityData();
  }, [communityID]);

  return { titleText, questions, polls, articles };
};

export default useCommunityPage;
