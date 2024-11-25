import express, { Response, Request } from 'express';
import {
  AddPointsRequest,
  AddUserRequest,
  EquipRewardRequest,
  FakeSOSocket,
  FRAMES,
  NewNotificationRequest,
  Notification,
  ToggleBlockedTypeRequest,
  User,
  UserResponse,
} from '../types';
import {
  findUser,
  saveUser,
  addPointsToUser,
  saveNotification,
  addNotificationToUser,
  populateNotification,
  usersToNotify,
  updateUserNotifsAsRead,
  equipReward,
  updateUsersUnlockedFrames,
  updateBlockedTypes,
} from '../models/application';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided user contains the required fields.
   *
   * @param user The user object to validate.
   *
   * @returns `true` if the user is valid, otherwise `false`.
   */
  function isUserValid(user: User): boolean {
    return !!user.username && !!user.password;
  }

  /**
   * Checks if the provided notification contains the required fields.
   *
   * @param notification The notification object to validate.
   *
   * @returns `true` if the notification is valid, otherwise `false`.
   */
  function isNotificationValid(notification: Notification): boolean {
    let isSourceTypeValid;
    if (notification.sourceType) {
      isSourceTypeValid = !!notification.source;
    } else {
      isSourceTypeValid = !notification.source;
    }

    return (
      !!notification.notificationType &&
      (notification.isRead !== undefined || notification.isRead != null) &&
      isSourceTypeValid
    );
  }

  /**
   * Adds a new user to the database. The add user request and user are validated then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The AddUserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUser = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!isUserValid(req.body)) {
      res.status(400).send('Invalid user');
      return;
    }

    const userInfo = req.body;

    try {
      const userFromDb = await saveUser(userInfo);

      if ('error' in userFromDb) {
        throw new Error(userFromDb.error as string);
      }

      res.json(userFromDb);
    } catch (err) {
      res.status(500).send(`${(err as Error).message}`);
    }
  };

  /**
   * Logs in an existing user. The user is retrieved from the database and checked against the provided password.
   * @param req - The request object containing the user data.
   * @param res - The HTTp response object.
   * @returns - The user object if the login is successful, otherwise an error message.
   */
  const loginUser = async (req: AddUserRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const user = await findUser(username);

      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      if (user.password !== password) {
        res.status(401).send('Invalid password');
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Error while logging in');
    }
  };

  /**
   * Adds points to a user to the database. If a user has reached the threshold to unlock
   * a new frame, the frame is added to the user's unlockedFrames.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The AddPointsRequest object containing user data and number of points to add.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addPoints = async (req: AddPointsRequest, res: Response) => {
    if (!req.body.username || !req.body.numPoints) {
      res.status(400).send('Invalid request');
      return;
    }

    const { username, numPoints } = req.body;

    try {
      const updatedPoints = await addPointsToUser(username, numPoints);
      if ('error' in updatedPoints) {
        throw new Error(updatedPoints.error as string);
      }

      // check if the user has unlocked a new frame, update user's frames if they have.
      const newUnlockedFrames = FRAMES.filter(
        frame =>
          frame.pointsNeeded <= updatedPoints.totalPoints &&
          !updatedPoints.unlockedFrames.includes(frame.name),
      ).map(frame => frame.name);

      let updatedUser: UserResponse;
      if (newUnlockedFrames.length) {
        updatedUser = await updateUsersUnlockedFrames(username, newUnlockedFrames);
      } else {
        updatedUser = updatedPoints;
      }
      if ('error' in updatedUser) {
        throw new Error(updatedUser.error as string);
      }

      if (newUnlockedFrames.length) {
        socket.emit('unlockedRewardUpdate', {
          username,
          rewards: newUnlockedFrames,
          type: 'frame',
        });
      }

      socket.emit('pointsUpdate', {
        username,
        pointsAdded: numPoints,
        totalPoints: updatedUser.totalPoints,
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send('Error when adding points to user');
    }
  };

  /**
   * Sets a user's equiped rewards.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The EquipRewardRequest object containing username and reward data to update.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const equipRewardToUser = async (req: EquipRewardRequest, res: Response) => {
    if (!req.body.username || !req.body.reward || !req.body.type) {
      res.status(400).send('Invalid request');
      return;
    }

    const { username, reward, type } = req.body;

    try {
      const status = await equipReward(username, reward, type);
      if ('error' in status) {
        throw new Error(status.error as string);
      }

      socket.emit('equippedRewardUpdate', status);
      res.json(status);
    } catch (error) {
      res.status(500).send('Error when equipping reward');
    }
  };

  /**
   * Creates notifications and one to each users to be notified in the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The NewNotificationRequest object containing an ObjectID and the notification to add.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const notify = async (req: NewNotificationRequest, res: Response) => {
    if (!req.body.oid || !req.body.notification || !isNotificationValid(req.body.notification)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { oid } = req.body;
    const notifInfo: Notification = req.body.notification;

    try {
      // get list of usernames to add a notification to
      const usernames = await usersToNotify(oid, notifInfo.notificationType);

      if ('error' in usernames || !usernames.length) {
        throw new Error('Error retrieving users to notify');
      }

      // save a notification to database for each user
      const notifsPromises = usernames.map(_ => saveNotification(notifInfo));
      const notifsFromDb = (await Promise.all(notifsPromises)).map(notifResponse => {
        if ('error' in notifResponse) {
          throw new Error(notifResponse.error as string);
        }
        return notifResponse;
      });

      // add the notification to all users to be notified
      const promiseNotifiedUsers = usernames.map((username, i) =>
        addNotificationToUser(username, notifsFromDb[i]),
      );
      (await Promise.all(promiseNotifiedUsers)).map(userResponse => {
        if (userResponse && 'error' in userResponse) {
          throw new Error(userResponse.error as string);
        }
        return userResponse.username;
      });

      // populate the notifications to return
      const promisePopulatedNotifs = notifsFromDb.map(notif =>
        populateNotification(notif._id?.toString(), notif.sourceType),
      );

      const populatedNotifs = (await Promise.all(promisePopulatedNotifs)).map(notifResponse => {
        if ('error' in notifResponse) {
          throw new Error(notifResponse.error as string);
        }
        return notifResponse;
      });

      // Populates the fields of the notification that was added and emits the usernames who received notifications
      socket.emit('notificationUpdate', { usernames });
      res.json(populatedNotifs);
    } catch (error) {
      res.status(500).send('Error when adding notification to user');
    }
  };

  /**
   * Retrieves an array of Notifications by a user's username.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The Request object containing the username as a parameter.
   * @param res The HTTP response object used to send back the array of notifications.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      const user = await findUser(username);

      if (!user) {
        throw new Error('Could not find user with the given username');
      }

      res.status(200).json(user.notifications);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when finding notifications for user: ${err.message}`);
      } else {
        res.status(500).send(`Error when finding notifications for user`);
      }
    }
  };

  /**
   * Updates all of the isRead statuses of all notifications for a user to be read.
   *
   * @param req - The Request object containing the username as a parameter.
   * @param res - The HTTP Response object used to send back the status showing the updates were successful.
   */
  const markAllNotifsAsRead = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      const updatedNotifs = await updateUserNotifsAsRead(username);

      if ('error' in updatedNotifs) {
        throw new Error(updatedNotifs.error);
      }

      socket.emit('notificationUpdate', { usernames: [username] });
      res.status(200).send('All user notifications marked as read');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error while marking all notifs of user as read: ${err.message}`);
      } else {
        res.status(500).send('Error while marking all notifs of user as read');
      }
    }
  };

  /**
   * Updates a users blocked NotificationTypes. Adds the notification type to the users blockedNotifications
   * if not already blocked. Otherwise, removes the type from the users blockedNotifications.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The ToggleBlockedTypeRequest object containing username and type to block/unblock.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateBlockedNotifications = async (req: ToggleBlockedTypeRequest, res: Response) => {
    if (!req.body.username || !req.body.type) {
      res.status(400).send('Invalid request');
      return;
    }

    const { username, type } = req.body;

    try {
      const status = await updateBlockedTypes(username, type);
      if ('error' in status) {
        throw new Error(status.error as string);
      }

      res.json(status.blockedNotifications);
    } catch (error) {
      res.status(500).send('Error when updating blocked notification types');
    }
  };

  router.post('/addUser', addUser);
  router.post('/login', loginUser);
  router.post('/addPoints', addPoints);
  router.post('/notify', notify);
  router.get('/getUserNotifications/:username', getUserNotifications);
  router.put('/markAllNotifsAsRead/:username', markAllNotifsAsRead);
  router.put('/updateEquippedReward', equipRewardToUser);
  router.put('/updateBlockedNotifications', updateBlockedNotifications);

  return router;
};

export default userController;
