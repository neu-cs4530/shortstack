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

    /**
     * Function to handle equipped reward updates from the socket.
     *
     * @param username - The user who's equipped reward was updated.
     * @param reward - The equipped reward.
     * @param type - The type of the reward, either a frame or a title.
     */
    const handleEquippedRewardUpdate = async ({
      username,
      reward,
      type,
    }: {
      username: string;
      reward: string;
      type: 'frame' | 'title';
    }) => {
      if (user && user.username === username) {
        if (type === 'frame') {
          setUser({ ...user, equippedFrame: reward });
        } else if (type === 'title') {
          setUser({ ...user, equippedTitle: reward });
        }
      }
    };

    if (socket) {
      socket.on('notificationUpdate', handleNotificationUpdate);
      socket.on('equippedRewardUpdate', handleEquippedRewardUpdate);
    }

    return () => {
      if (socket) {
        socket.off('notificationUpdate', handleNotificationUpdate);
        socket.off('equippedRewardUpdate', handleEquippedRewardUpdate);
      }
    };
  }, [socket, user]);

  return { user, setUser };
};

export default useFakeStackOverflow;
