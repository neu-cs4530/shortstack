import { useEffect, useState } from 'react';
import { User, NotificationResponse, FakeSOSocket } from '../types';

const useFakeStackOverflow = (socket: FakeSOSocket | null) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    /**
     * Function to handle notification updates from the socket.
     *
     * @param usernames - The list of usernames the notification is being sent to.
     * @param notification - The NotificationResponse object.
     */
    const handleNotificationUpdate = ({
      usernames,
      notification,
    }: {
      usernames: string[];
      notification: NotificationResponse;
    }) => {
      if (user && !('error' in notification) && usernames.includes(user.username)) {
        setUser({ ...user, notifications: [notification, ...user.notifications] });
      }
    };

    if (socket) {
      socket.on('notificationUpdate', handleNotificationUpdate);
    }

    return () => {
      if (socket) {
        socket.off('notificationUpdate', handleNotificationUpdate);
      }
    };
  }, [socket, user]);

  return { user, setUser };
};

export default useFakeStackOverflow;
