import { ChangeEvent, useState } from 'react';
import { addArticleToCommunity } from '../services/communityService';
import { updateArticleById } from '../services/articleService';
import { Article } from '../types';

/**
 * Custom hook for managing the state of an article form.
 * @returns articleTitleInput - The current input for the article title
 * @returns articleBodyInput - The current input for the article body
 * @returns handleArticleTitleInputChange - Function to handle title input change
 * @returns handleArticleBodyInputChange - Function to handle body input change
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

  const handleArticleTitleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArticleTitleInput(e.target.value);
  };

  const handleArticleBodyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArticleBodyInput(e.target.value);
  };

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
      } else if (articleId) {
        const updatedArticle = await updateArticleById(articleId, article);
        submitCallback(updatedArticle);
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
