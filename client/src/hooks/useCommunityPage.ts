import { useEffect, useState, KeyboardEvent, ChangeEvent } from 'react';
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
 * @returns currentTab - The tab selected by the user indicating what community content they want to see.
 * @returns setCurrentTab - Function to set the tab the user has selected
 * @returns searchBarValue - the current input inside of the search bar.
 * @returns handleInputChange - function to handle changes in the search bar's input field.
 * @returns handleKeyDown - function to handle 'Enter' key press and trigger the search.
 * @returns filterArticlesBySearch - function to filter the community's articles with the entered search term.
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
  const [currentTab, setCurrentTab] = useState<'Questions' | 'Articles' | 'Polls'>('Questions');
  const [searchBarValue, setSearchBarValue] = useState<string>('');
  const [enteredSearch, setEnteredSearch] = useState<string>('');

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

  useEffect(() => {
    /**
     * Function to update a poll in the list if a pollUpdate socket event is received.
     * @param poll - The updated poll from the event
     */
    const updatePoll = (poll: Poll) => {
      const hasPoll = polls.some(p => p._id === poll._id);
      if (hasPoll) {
        const filteredPolls = polls.filter(p => p._id !== poll._id);
        setPolls([...filteredPolls, poll]);
      } else {
        setPolls([...polls, poll]);
      }
    };

    socket.on('pollUpdate', updatePoll);

    return () => {
      socket.off('pollUpdate', updatePoll);
    };
  }, [polls, socket]);

  /**
   * Function to handle changes in the input field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value);
  };

  /**
   * Function to handle 'Enter' key press and trigger the search.
   *
   * @param e - the event object.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      setEnteredSearch(searchBarValue);
    }
  };

  /**
   * Function to filter the community's articles with the search term -- looking for the term in
   * each article's title or body.
   * @returns A list of articles that include the entered search term.
   */
  const filterArticlesBySearch = (): Article[] =>
    articles.filter(article => {
      console.log(article);
      const upcaseTitle = article.title.toUpperCase();
      const upcaseBody = article.body.toUpperCase();
      const upcaseSearchTerm = enteredSearch.toUpperCase();

      return upcaseTitle.includes(upcaseSearchTerm) || upcaseBody.includes(upcaseSearchTerm);
    });

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
    currentTab,
    setCurrentTab,
    searchBarValue,
    handleInputChange,
    handleKeyDown,
    filterArticlesBySearch,
  };
};

export default useCommunityPage;
