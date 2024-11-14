import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Function to mark a notification as read.
 *
 * @param notifId - The ID of the notification to mark as read.
 * @returns The notification, marked as read
 * @throws Error if the operation failed
 */
const markNotifAsRead = async (notifId: string): Promise<Notification> => {
  const res = await api.put(`${NOTIFICATION_API_URL}/markAsRead/${notifId}`);
  if (res.status !== 200) {
    throw new Error('Error marking notification as read');
  }
  return res.data;
};

export default markNotifAsRead;
