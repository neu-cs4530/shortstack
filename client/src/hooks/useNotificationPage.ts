import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { markAllNotifsAsRead } from '../services/userService';
import useUserContext from './useUserContext';
import { Notification } from '../types';

/**
 * Custom hook to handle logic for the notification page
 * @returns notifications - The notifications to render
 * @returns handleReadAll - Function to mark all notifications as read.
 * @returns handleNotificationSettings - Function to navigate to the notifications settings page.
 */
const useNotificationPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications([...user.notifications]);
  }, [user.notifications]);

  /**
   * Function to handle navigating to the notifications settings page.
   */
  const handleNotificationSettings = async () => {
    navigate('/notifications/settings');
  };

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

  return { notifications, handleReadAll, handleNotificationSettings };
};

export default useNotificationPage;
