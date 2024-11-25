import { useEffect, useState } from 'react';
import {
  User,
  FakeSOSocket,
  Notification,
  NotificationType,
  EquippedRewardUpdatePayload,
  UnlockedRewardUpdatePayload,
  NotificationSettingsUpdatePayload,
} from '../types';
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
    const handleEquippedRewardUpdate = async ({
      username,
      reward,
      type,
    }: EquippedRewardUpdatePayload) => {
      if (user && user.username === username) {
        if (type === 'frame') {
          setUser({ ...user, equippedFrame: reward });
        } else if (type === 'title') {
          setUser({ ...user, equippedTitle: reward });
        }
      }
    };

    const handleUnlockedRewardUpdate = async ({
      username,
      rewards,
      type,
    }: UnlockedRewardUpdatePayload) => {
      if (user && user.username === username) {
        if (type === 'title' && !user.unlockedTitles.some(t => rewards.includes(t))) {
          setUser({ ...user, unlockedTitles: [...user.unlockedTitles, ...rewards] });
        }
        if (type === 'frame' && !user.unlockedFrames.some(t => rewards.includes(t))) {
          setUser({ ...user, unlockedFrames: [...user.unlockedFrames, ...rewards] });
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

    /**
     * Function to handle notification settings updates from the socket.
     *
     * @param username - The user who's notification settings were updated.
     * @param notificationType - The notification type that was toggled
     * @param isBlocked - Whether the setting was turned off or on.
     */
    const handleNotificationSettingsUpdate = async ({
      username,
      notificationType,
      isBlocked,
    }: NotificationSettingsUpdatePayload) => {
      if (user && user.username === username) {
        if (isBlocked) {
          setUser({
            ...user,
            blockedNotifications: [...user.blockedNotifications, notificationType],
          });
        } else {
          setUser({
            ...user,
            blockedNotifications: user.blockedNotifications.filter(nt => nt !== notificationType),
          });
        }
      }
    };

    if (socket) {
      socket.on('notificationUpdate', handleNotificationUpdate);
      socket.on('singleNotifUpdate', handleSingleNotifUpdate);
      socket.on('equippedRewardUpdate', handleEquippedRewardUpdate);
      socket.on('unlockedRewardUpdate', handleUnlockedRewardUpdate);
      socket.on('pointsUpdate', handlePointsUpdate);
      socket.on('notificationSettingsUpdate', handleNotificationSettingsUpdate);
    }

    return () => {
      if (socket) {
        socket.off('notificationUpdate', handleNotificationUpdate);
        socket.off('singleNotifUpdate', handleSingleNotifUpdate);
        socket.off('equippedRewardUpdate', handleEquippedRewardUpdate);
        socket.off('unlockedRewardUpdate', handleUnlockedRewardUpdate);
        socket.off('pointsUpdate', handlePointsUpdate);
        socket.off('notificationSettingsUpdate', handleNotificationSettingsUpdate);
      }
    };
  }, [socket, user]);

  return { user, setUser };
};

export default useFakeStackOverflow;
