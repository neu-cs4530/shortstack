import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { FakeSOSocket, FindArticleById } from '../types';
import { fetchArticleById } from '../models/application';

const articleController = (socket: FakeSOSocket) => {
  const router = express.Router();

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

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getArticleById/:articleID', getArticleById);

  return router;
};

export default articleController;
