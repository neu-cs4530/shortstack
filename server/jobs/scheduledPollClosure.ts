import { closeExpiredPolls, notifyUsers } from '../models/application';
import { FakeSOSocket, Notification, NotificationType } from '../types';

/**
 * Function to run on an interval. Checks the database for any new Polls whose due dates are expired,
 * and updated their closed status. Sends notifications to any users who voted in the polls that a poll
 * they participated in has closed.
 *
 * @param {FakeSOSocket} socket - The socket used to communicate events to clients.
 * @returns - A promise that resolves to void.
 */
const scheduledPollClosure = async (socket: FakeSOSocket): Promise<void> => {
  try {
    const newlyClosedPolls = await closeExpiredPolls();
    if ('error' in newlyClosedPolls) {
      throw new Error(newlyClosedPolls.error);
    }

    const promiseNotifications = newlyClosedPolls.map(poll => {
      const notif: Notification = {
        notificationType: NotificationType.PollClosed,
        sourceType: 'Poll',
        source: poll,
        isRead: false,
      };
      return notifyUsers(poll._id?.toString(), notif);
    });

    const usersToNotify = (await Promise.all(promiseNotifications)).map(usernames => {
      if ('error' in usernames) {
        throw new Error(usernames.error as string);
      }
      return usernames;
    });

    usersToNotify.forEach(usernames => socket.emit('notificationUpdate', { usernames }));
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default scheduledPollClosure;
