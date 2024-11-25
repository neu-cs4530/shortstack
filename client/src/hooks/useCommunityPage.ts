import { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import { Question, Poll, Article, ArticleSortOption } from '../types';
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
 * @returns searchedAndSortedArticles - the articles filtered by the search term and sorted by the sort value.
 * @returns articleSortOption - the option to sort the articles by.
 * @returns handleChangeArticleSortOption - Function to handle changes to the article sort option.
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
  const [searchedAndSortedArticles, setSearchedAndSortedArticles] = useState<Article[]>([]);
  const [articleSortOption, setArticleSortOption] = useState<ArticleSortOption>('Newest');

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
          setSearchedAndSortedArticles(communityData.articles || []);
        }
      } catch (error) {
        throw new Error('Failed to fetch community data');
      }
    };
    fetchCommunityData();
  }, [communityID, user.username]);

  useEffect(() => {
    /**
     * Updates the question list when a new question is added.
     * @param question - The newly added question
     */
    const handleQuestionAdded = (question: Question) => {
      setQuestions(prevQuestions => {
        // Check if the question already exists in the state
        if (prevQuestions.some(q => q._id === question._id)) {
          return prevQuestions; // If it exists, return the previous state
        }
        return [...prevQuestions, question];
      });
    };

    // Use a clear and consistent event name
    socket.on('questionUpdate', handleQuestionAdded);

    return () => {
      socket.off('questionUpdate', handleQuestionAdded);
    };
  }, [socket]);

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

  useEffect(() => {
    let updatedArticles = [...articles];

    // filter the articles according to the search bar value
    if (searchBarValue) {
      updatedArticles = articles.filter(article => {
        const upcaseTitle = article.title.toUpperCase();
        const upcaseBody = article.body.toUpperCase();
        const upcaseSearchTerm = searchBarValue.toUpperCase();

        return upcaseTitle.includes(upcaseSearchTerm) || upcaseBody.includes(upcaseSearchTerm);
      });
    }

    // sort the articles according to the sort option
    switch (articleSortOption) {
      case 'Newest':
        updatedArticles.sort(
          (a: Article, b: Article) =>
            new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime(),
        );
        break;
      case 'Oldest':
        updatedArticles.sort(
          (a: Article, b: Article) =>
            new Date(a.createdDate!).getTime() - new Date(b.createdDate!).getTime(),
        );
        break;
      case 'Recently Edited':
        updatedArticles.sort(
          (a: Article, b: Article) =>
            new Date(b.latestEditDate!).getTime() - new Date(a.latestEditDate!).getTime(),
        );
        break;
      default:
        break;
    }

    setSearchedAndSortedArticles(updatedArticles);
  }, [articles, articleSortOption, searchedAndSortedArticles, searchBarValue]);

  /**
   * Function to handle changes in the input field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value);
  };

  /**
   * Function to handle changes to the article sort option.
   *
   * @param e - the event object.
   */
  const handleChangeArticleSortOption = (e: SelectChangeEvent) => {
    setArticleSortOption(e.target.value as ArticleSortOption);
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
    currentTab,
    setCurrentTab,
    searchBarValue,
    handleInputChange,
    searchedAndSortedArticles,
    articleSortOption,
    handleChangeArticleSortOption,
  };
};

export default useCommunityPage;
