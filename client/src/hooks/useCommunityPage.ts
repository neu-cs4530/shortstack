import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question, Poll, Article } from '../types';
import { getCommunityDetails } from '../services/communityService';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the community page state, fetching community data, and handling real-time updates.
 *
 * @returns communityId - The ID of the community
 * @returns titleText - The title of the community page
 * @returns questions - List of questions in the community
 * @returns polls - List of polls in the community
 * @returns articles - List of articles in the community
 * @returns canEdit - Whether the user can edit the community (if they are in the community)
 * @returns isCreatingArticle - Is the user creating an article
 * @returns toggleCreateArticleForm - Function to toggle between the article creation form and the community page
 * @returns setArticles - Function to set the articles array
 */
const useCommunityPage = () => {
  const { user, socket } = useUserContext();
  const { communityID } = useParams<{ communityID: string }>();
  const [titleText, setTitleText] = useState<string>('Community');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isCreatingArticle, setIsCreatingArticle] = useState<boolean>(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        if (communityID) {
          const communityData = await getCommunityDetails(communityID);
          setTitleText(communityData.name);
          setQuestions(communityData.questions || []);
          setPolls(communityData.polls || []);
          setArticles(communityData.articles || []);
          setCanEdit(communityData.members.some(m => m === user.username));
        }
      } catch (error) {
        throw new Error('Failed to fetch community data');
      }
    };
    fetchCommunityData();
  }, [communityID, user.username]);

  useEffect(() => {
    /**
     * Function to update the appropriate article in the list if an articleUpdate socket event is received.
     * @param article - The article from the event
     */
    const updateArticle = (article: Article) => {
      const hasArticle = articles.some(a => a._id === article._id);
      if (hasArticle) {
        const filteredArticles = articles.filter(a => a._id !== article._id);
        setArticles([...filteredArticles, article]);
      } else {
        setArticles([...articles, article]);
      }
    };

    socket.on('articleUpdate', updateArticle);

    return () => {
      socket.off('articleUpdate', updateArticle);
    };
  }, [articles, socket]);

  const toggleCreateArticleForm = () => {
    setIsCreatingArticle(!isCreatingArticle);
  };

  return {
    communityID,
    titleText,
    questions,
    polls,
    articles,
    canEdit,
    isCreatingArticle,
    toggleCreateArticleForm,
    setArticles,
  };
};

export default useCommunityPage;
