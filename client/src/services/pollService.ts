import { Poll, PollVoteData } from '../types';
import api from './config';

const POLL_API_URL = `${process.env.REACT_APP_SERVER_URL}/poll`;

/**
 * Function to get a Poll by its ID.
 *
 * @param notifId - The ID of the poll.
 * @returns The poll
 * @throws Error if the operation failed
 */
const getPollById = async (pollId: string): Promise<Poll> => {
  const res = await api.get(`${POLL_API_URL}/getPollById/${pollId}`);
  if (res.status !== 200) {
    throw new Error('Error fetching poll');
  }
  return res.data;
};

/**
 * Function to vote on a poll.
 *
 * @param voteData - An object containing pollId, optionId, and username.
 * @returns The updated poll
 * @throws Error if the operation failed
 */
const voteOnPoll = async (voteData: PollVoteData) => {
  const res = await api.post(`${POLL_API_URL}/voteOnPoll`, voteData);
  if (res.status !== 200) {
    throw new Error('Error voting on poll');
  }
  return res.data;
};

export { getPollById, voteOnPoll };
