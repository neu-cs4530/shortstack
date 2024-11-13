import { ChangeEvent, useState } from 'react';
import { addArticleToCommunity } from '../services/communityService';
import { updateArticleById } from '../services/articleService';
import { Article, Notification, NotificationType } from '../types';
import { notifyUsers } from '../services/userService';

/**
 * Custom hook for managing the state of an article form.
 * @param communityId - The ID of the community this article will be a part of if the user is creating a new article. Optional field
 * @param title - The initial title of the article if the user is editing. Optional field
 * @param body - The initial body of the article if the user is editing. Optional field
 * @param articleId - The ID of the article if the user is editing. Optional field
 * @param submitCallback - Callback function to be called when the article is submitted.
 * @returns articleTitleInput - The current input for the article title
 * @returns articleBodyInput - The current input for the article body
 * @returns handleArticleTitleInputChange - Function to handle title input change
 * @returns handleArticleBodyInputChange - Function to handle body input change
 * @returns handleArticleSubmit - Function to handle submitting the article
 */
const useArticleForm = ({
  communityId,
  title,
  body,
  articleId,
  submitCallback,
}: {
  communityId?: string;
  title?: string;
  body?: string;
  articleId?: string;
  submitCallback: (newArticle: Article) => void;
}) => {
  const [articleTitleInput, setArticleTitleInput] = useState<string>(title || '');
  const [articleBodyInput, setArticleBodyInput] = useState<string>(body || '');

  /**
   * Function to handle article title input change.
   *
   * @param e - the event object.
   */
  const handleArticleTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArticleTitleInput(e.target.value);
  };

  /**
   * Function to handle article body input change.
   *
   * @param e - the event object.
   */
  const handleArticleBodyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArticleBodyInput(e.target.value);
  };

  /**
   * Function to notify members of a community of a new article or article update
   *
   * @param article - the new/updated article.
   * @param type - The notification type.
   */
  const sendArticleNotification = async (
    article: Article,
    type: NotificationType,
  ): Promise<void> => {
    if (article._id) {
      const notif: Notification = {
        notificationType: type,
        sourceType: 'Article',
        source: article,
        isRead: false,
      };
      await notifyUsers(article._id, notif);
    }
  };

  /**
   * Function to handle submitting an article.
   *
   * @param e - the event object.
   */
  const handleArticleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const article: Article = {
      title: articleTitleInput,
      body: (document.getElementById('articleBodyInputElement') as HTMLTextAreaElement).value,
    };

    try {
      if (communityId && !articleId) {
        const createdArticle = await addArticleToCommunity(communityId, article);
        submitCallback(createdArticle);
        await sendArticleNotification(createdArticle, NotificationType.NewArticle);
      } else if (articleId) {
        const updatedArticle = await updateArticleById(articleId, article);
        submitCallback(updatedArticle);
        await sendArticleNotification(updatedArticle, NotificationType.NewArticle);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(`An error occurred while submitting the article: ${(error as Error).message}`);
    }
  };

  return {
    articleTitleInput,
    articleBodyInput,
    handleArticleTitleInputChange,
    handleArticleBodyInputChange,
    handleArticleSubmit,
  };
};

export default useArticleForm;
