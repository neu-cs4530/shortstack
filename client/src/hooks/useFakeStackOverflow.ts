import { useEffect, useState } from 'react';
import { User, FakeSOSocket, Notification, RewardUpdatePayload, NotificationType } from '../types';
import { getUserNotifications, notifyUsers } from '../services/userService';

/**
 * Custom hook to manage the state and logic of FakeStackOverflow.
 *
 * @param socket - the WebSocket connection associated with the current user.
 * @returns user - the user currently logged in
 * @returns setUser - function to set the currently logged in user
 */
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
    const handleEquippedRewardUpdate = async ({ username, reward, type }: RewardUpdatePayload) => {
      if (user && user.username === username) {
        if (type === 'frame') {
          setUser({ ...user, equippedFrame: reward });
        } else if (type === 'title') {
          setUser({ ...user, equippedTitle: reward });
        }
      }
    };

    const handleUnlockedRewardUpdate = async ({ username, reward, type }: RewardUpdatePayload) => {
      if (user && user.username === username) {
        if (type === 'title' && !user.unlockedTitles.some(t => t === reward)) {
          setUser({ ...user, unlockedTitles: [...user.unlockedTitles, reward] });
        }
        const notif: Notification = {
          notificationType: NotificationType.NewReward,
          isRead: false,
        };
        if (user._id) {
          await notifyUsers(user._id, notif);
        }
      }
    };

    if (socket) {
      socket.on('notificationUpdate', handleNotificationUpdate);
      socket.on('singleNotifUpdate', handleSingleNotifUpdate);
      socket.on('equippedRewardUpdate', handleEquippedRewardUpdate);
      socket.on('unlockedRewardUpdate', handleUnlockedRewardUpdate);
    }

    return () => {
      if (socket) {
        socket.off('notificationUpdate', handleNotificationUpdate);
        socket.off('singleNotifUpdate', handleSingleNotifUpdate);
        socket.off('equippedRewardUpdate', handleEquippedRewardUpdate);
        socket.off('unlockedRewardUpdate', handleUnlockedRewardUpdate);
      }
    };
  }, [socket, user]);

  return { user, setUser };
};

export default useFakeStackOverflow;
