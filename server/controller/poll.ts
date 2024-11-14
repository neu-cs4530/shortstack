import express, { Response } from 'express';
import { fetchPollById } from '../models/application';

const pollController = () => {
  const router = express.Router();

  /**
   * Gets the Poll with the ID.
   *
   * @param req The request object containing the pollId param.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getPollById = async (req: express.Request, res: Response): Promise<void> => {
    const { pollId } = req.params;

    try {
      const poll = await fetchPollById(pollId);

      if ('error' in poll) {
        throw new Error(poll.error);
      }

      res.json(poll);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  router.get('/getPollById/:pollId', getPollById);

  return router;
};

export default pollController;
