import { useEffect, useState } from 'react';
import { markAllNotifsAsRead } from '../services/userService';
import useUserContext from './useUserContext';
import { Notification } from '../types';

/**
 * Custom hook to handle logic for the notification page
 * @returns notifications - The notifications to render
 * @returns handleReadAll - Function to mark all notifications as read.
 */
const useNotificationPage = () => {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications([...user.notifications]);
  }, [user.notifications]);

  /**
   * Function that sets the status of all notifications for the logged in user to read.
   */
  const handleReadAll = async () => {
    // res should be the array of notifications with their status updated.
    if (user) {
      try {
        await markAllNotifsAsRead(user.username);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error while updating all notifications as read');
      }
    }
  };

  return { notifications, handleReadAll };
};

export default useNotificationPage;
