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

    /**
     * Function to handle user point updates from the socket.
     *
     * @param username - The user who's points were updated.
     * @param pointsAdded - The number of points added.
     * @param totalPoints - The user's total points.
     */
    const handlePointsUpdate = async ({
      username,
      totalPoints,
    }: {
      username: string;
      pointsAdded: number;
      totalPoints: number;
    }) => {
      if (user && user.username === username) {
        setUser({ ...user, totalPoints });
      }
    };

    if (socket) {
      socket.on('notificationUpdate', handleNotificationUpdate);
      socket.on('singleNotifUpdate', handleSingleNotifUpdate);
      socket.on('equippedRewardUpdate', handleEquippedRewardUpdate);
      socket.on('pointsUpdate', handlePointsUpdate);
    }

    return () => {
      if (socket) {
        socket.off('notificationUpdate', handleNotificationUpdate);
        socket.off('singleNotifUpdate', handleSingleNotifUpdate);
        socket.off('equippedRewardUpdate', handleEquippedRewardUpdate);
        socket.off('pointsUpdate', handlePointsUpdate);
      }
    };
  }, [socket, user]);

  return { user, setUser };
};

export default useFakeStackOverflow;
