import { useEffect, useState } from 'react';
import { User, FakeSOSocket } from '../types';
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
