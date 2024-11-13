import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Article } from '../types';
import { getCommunityMembersByObjectId } from '../services/communityService';
import useUserContext from './useUserContext';
import { getArticleById } from '../services/articleService';

/**
 * Custom hook to handle community article render logic.
 *
 * @returns article - The article
 * @returns isEditing - State value representing if the user is editing the article
 * @returns toggleEditMode - Function to toggle the edit mode
 */
const useCommunityArticle = () => {
  const artID = useParams<{ articleID: string }>().articleID;
  const navigate = useNavigate();
  const { user, socket } = useUserContext();

  const [articleID, setArticleID] = useState<string>(artID || '');
  const [article, setArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    if (!artID) {
      navigate('/community');
      return;
    }

    setArticleID(artID);
  }, [artID, navigate]);

  useEffect(() => {
    if (!artID) {
      return;
    }

    const fetchCommunityMembers = async (oid: string) => {
      try {
        const communityMembers = await getCommunityMembersByObjectId(oid, 'Article');
        setCanEdit(communityMembers.some(member => member === user.username));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error((error as Error).message);
      }
    };

    fetchCommunityMembers(artID);
  }, [user.username, artID]);

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      try {
        const res = await getArticleById(articleID);
        setArticle(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching article:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [articleID]);

  useEffect(() => {
    /**
     * Function to update the article if an articleUpdate socket event is received.
     * @param updatedArticle - The updatedArticle from the event
     */
    const updateArticle = (updatedArticle: Article) => {
      if (updatedArticle._id === article?._id) {
        setArticle(updatedArticle);
      }
    };

    socket.on('articleUpdate', updateArticle);

    return () => {
      socket.off('articleUpdate', updateArticle);
    };
  }, [socket, article]);

  /**
   * Function to toggle between edit modes.
   */
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return {
    article,
    isEditing,
    canEdit,
    toggleEditMode,
    setArticle,
  };
};

export default useCommunityArticle;
