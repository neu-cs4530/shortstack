import express, { Response } from 'express';
import {
  ChallengeProgressRequest,
  FakeSOSocket,
  UserChallenge,
  UserChallengeRequest,
} from '../types';
import {
  fetchAndIncrementChallengesByUserAndType,
  fetchUserChallengesByUsername,
} from '../models/application';

const challengeController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Handles incrementing challenge progress for challenges matching the given type for the given user.
   *
   * @param req - The ChallengeProgressRequest object containing the user's username and the ChallengeType.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const incrementChallengeProgress = async (
    req: ChallengeProgressRequest,
    res: Response,
  ): Promise<void> => {
    const { challengeType, username } = req.params;

    try {
      const response = await fetchAndIncrementChallengesByUserAndType(username, challengeType);

      if ('error' in response) {
        throw new Error(response.error);
      }

      response.forEach(uc => {
        // TODO: if a challenge is completed, send a notification to the user
        if (uc.progress.length >= uc.challenge.actionAmount) {
          socket.emit('unlockedRewardUpdate', {
            username,
            reward: uc.challenge.reward,
            type: 'title', // all challenge rewards are titles
          });
        }
      });

      res.json(response as UserChallenge[]);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  /**
   * Gets all the challenges for a given user.
   *
   * @param req - The UserChallengeRequest object containing the user's username.
   * @param res - The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserChallenges = async (
    req: UserChallengeRequest,
    res: express.Response,
  ): Promise<void> => {
    const { username } = req.params;

    try {
      const response = await fetchUserChallengesByUsername(username);

      if ('error' in response) {
        throw new Error(response.error);
      }

      res.json(response as UserChallenge[]);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  router.put('/progress/:challengeType/:username', incrementChallengeProgress);
  router.get('/:username', getUserChallenges);

  return router;
};

export default challengeController;
