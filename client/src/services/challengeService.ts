import { ChallengeType, UserChallenge } from '../types';
import api from './config';

const CHALLENGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/challenge`;

/**
 * Function to make progress for the user in all challenges under the challengeType.
 *
 * @param username - The username of the user.
 * @param challengeType - The type of challenge to make progress for.
 * @throws Error if there is an issue making progress.
 */
const incrementChallengeProgress = async (
  username: string,
  challengeType: ChallengeType,
): Promise<UserChallenge[]> => {
  const res = await api.put(`${CHALLENGE_API_URL}/progress/${challengeType}/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when making challenge progress');
  }
  return res.data;
};

export default incrementChallengeProgress;
