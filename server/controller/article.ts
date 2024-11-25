import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Article, FakeSOSocket, FindArticleById, UpdateArticleRequest } from '../types';
import { fetchArticleById, updateArticleById } from '../models/application';

const articleController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Function to check if an article is valid.
   * @param article - The article
   * @returns true if the article contains a title and body, false otherwise.
   */
  const isValidArticle = (article: Article): boolean => !!article.title && !!article.body;

  /**
   * Fetches a specific article by its ID.
   *
   * @param req The HTTP request object containing the article ID as a parameter.
   * @param res The HTTP response object used to send back the article details.
   *
   * @returns A Promise that resolves to void.
   */
  const getArticleById = async (req: FindArticleById, res: Response): Promise<void> => {
    const { articleID } = req.params;

    if (!ObjectId.isValid(articleID)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const article = await fetchArticleById(articleID);
      if ('error' in article) {
        throw new Error(article.error);
      }
      res.status(200).json(article);
    } catch (error) {
      res.status(500).send('Error fetching article by ID');
    }
  };

  /**
   * Updates the article with the given ID.
   * @param req The HTTP request object containing the article ID as a parameter and article fields as the body.
   * @param res The HTTP response object used to send back the article details.
   */
  const updateArticle = async (req: UpdateArticleRequest, res: Response): Promise<void> => {
    const { articleID } = req.params;
    const { newArticle } = req.body;

    if (!ObjectId.isValid(articleID)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    if (!isValidArticle(newArticle)) {
      res.status(400).send('Invalid request body');
      return;
    }

    try {
      // update recently edited date to now
      newArticle.latestEditDate = new Date();

      const updatedArticle = await updateArticleById(articleID, newArticle);

      if (updatedArticle && 'error' in updatedArticle) {
        throw new Error(updatedArticle.error);
      }

      socket.emit('articleUpdate', updatedArticle);
      res.json(updatedArticle);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getArticleById/:articleID', getArticleById);
  router.put('/updateArticle/:articleID', updateArticle);

  return router;
};

export default articleController;
