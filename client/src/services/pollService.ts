import { Poll } from '../types';
import api from './config';

const POLL_API_URL = `${process.env.REACT_APP_SERVER_URL}/poll`;

/**
 * Function to mark a notification as read.
 *
 * @param notifId - The ID of the notification to mark as read.
 * @returns The notification, marked as read
 * @throws Error if the operation failed
 */
const getPollById = async (pollId: string): Promise<Poll> => {
  const res = await api.get(`${POLL_API_URL}/getPollById/${pollId}`);
  if (res.status !== 200) {
    throw new Error('Error fetching poll');
  }
  return res.data;
};

export default getPollById;
