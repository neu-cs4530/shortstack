import express, { Response } from 'express';
import { addVoteToPollOption, fetchPollById } from '../models/application';
import { FakeSOSocket, GetPollByIdRequest, VoteOnPollRequest } from '../types';

const pollController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Gets the Poll with the ID.
   *
   * @param req The request object containing the pollId param.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getPollById = async (req: GetPollByIdRequest, res: Response): Promise<void> => {
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

  /**
   * Handles voting on a poll option.
   *
   * @param req The request object containing the pollId, optionId, and username in the body.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const voteOnPoll = async (req: VoteOnPollRequest, res: Response): Promise<void> => {
    const { pollId, optionId, username } = req.body;

    if (!pollId || !optionId || !username) {
      res.status(400).send('Invalid request body');
      return;
    }

    try {
      const result = await addVoteToPollOption(pollId, optionId, username);

      if ('error' in result) {
        res.status(400).send(result.error);
        return;
      }

      socket.emit('pollUpdate', result);
      socket.emit('pollVoteUpdate', result);

      res.json(result);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  router.get('/getPollById/:pollId', getPollById);
  router.post('/voteOnPoll', voteOnPoll);

  return router;
};

export default pollController;
