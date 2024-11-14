import { useNavigate } from 'react-router-dom';
import { NotificationProps, NotificationType } from '../types';
import markNotifAsRead from '../services/notificationService';

/**
 * Custom hook to handle notification operations
 *
 * @param notif - The notification.
 * @returns handleNotificationClick - Function to handle clicking on the notification
 */
const useNotification = ({ notif }: NotificationProps) => {
  const navigate = useNavigate();

  const handleNotificationClick = async () => {
    let sourcePath = '';

    if (notif.notificationType === NotificationType.NewReward) {
      sourcePath = '/profile/rewards';
    } else {
      if (!notif.source) {
        // eslint-disable-next-line no-console
        console.error('Invalid notification, missing source');
      }
      switch (notif.sourceType) {
        case 'Question':
          sourcePath = `/question/${notif.source?._id}`;
          break;
        case 'Article':
          sourcePath = `/community/article/${notif.source?._id}`;
          break;
        case 'Poll':
          sourcePath = `/community/poll/${notif.source?._id}`;
          break;
        default:
          // eslint-disable-next-line no-console
          console.error('Cannot navigate to notification source, invalid source');
      }
    }

    if (notif._id) {
      await markNotifAsRead(notif._id);
    }
    navigate(sourcePath);
  };

  return { handleNotificationClick };
};

export default useNotification;
