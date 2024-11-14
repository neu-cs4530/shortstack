import { useEffect, useState } from 'react';
import { User, FakeSOSocket, Notification } from '../types';
import { getUserNotifications } from '../services/userService';

const useFakeStackOverflow = (socket: FakeSOSocket | null) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    /**
     * Function to handle notification updates from the socket.
     *
     * @param usernames - The list of usernames the notification is being sent to.
     */
    const handleNotificationUpdate = async ({ usernames }: { usernames: string[] }) => {
      if (user && usernames.includes(user.username)) {
        const updatedNotifs = await getUserNotifications(user.username);
        setUser({ ...user, notifications: updatedNotifs });
      }
    };

    /**
     * Function to handle single notification updates from the socket.
     *
     * @param notif - The notification that was updated.
     */
    const handleSingleNotifUpdate = (notif: Notification) => {
      if (user?.notifications.some(n => n._id === notif._id)) {
        const updatedNotifs = user.notifications.map(n => {
          if (n._id === notif._id) {
            return { ...n, isRead: true };
          }
          return n;
        });
        setUser({ ...user, notifications: updatedNotifs });
      }
    };

    if (socket) {
      socket.on('notificationUpdate', handleNotificationUpdate);
      socket.on('singleNotifUpdate', handleSingleNotifUpdate);
    }

    return () => {
      if (socket) {
        socket.off('notificationUpdate', handleNotificationUpdate);
        socket.off('singleNotifUpdate', handleSingleNotifUpdate);
      }
    };
  }, [socket, user]);

  return { user, setUser };
};

export default useFakeStackOverflow;
