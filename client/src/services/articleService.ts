import { Article } from '../types';
import api from './config';

const ARTICLE_API_URL = `${process.env.REACT_APP_SERVER_URL}/article`;

/**
 * Function to get an article by its ID.
 *
 * @param articleID - The ID of the article to retrieve.
 * @throws Error if there is an issue fetching the article by ID.
 */
const getArticleById = async (articleID: string): Promise<Article> => {
  const res = await api.get(`${ARTICLE_API_URL}/getArticleById/${articleID}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching article by ID');
  }
  return res.data;
};

export default getArticleById;
