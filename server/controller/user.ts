import express, { Response } from 'express';
import {
  AddPointsRequest,
  AddUserRequest,
  FakeSOSocket,
  NewNotificationRequest,
  Notification,
  NotificationResponse,
  User,
} from '../types';
import {
  findUser,
  saveUser,
  addPointsToUser,
  saveNotification,
  addNotificationToUser,
  populateNotification,
  usersToNotify,
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
   * Adds points to a user to the database.
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
      const updatedUser = await addPointsToUser(username, numPoints);
      if (updatedUser && 'error' in updatedUser) {
        throw new Error(updatedUser.error as string);
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).send('Error when adding points to user');
    }
  };

  /**
   * Creates a notification and it to users in the database.
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

      const copyOfUsers = [...usernames];

      // save a notification to database for each user
      const notifsPromises = copyOfUsers.map(_ => saveNotification(notifInfo));
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
      // const promiseNotifiedUsers = usernames.map(username =>
      //   addNotificationToUser(username, notifFromDb),
      // );
      const notifiedUsers = (await Promise.all(promiseNotifiedUsers)).map(userResponse => {
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

      // Populates the fields of the notification that was added and emits the new object
      // TODO: in client notification page, listen on 'notificationUpdate' for displaying notifications
      // and showing unread notification indicator.
      usernames.map((username, i) =>
        socket.emit('notificationUpdate', {
          username,
          notification: populatedNotifs[i] as NotificationResponse,
        }),
      );
      res.json(populatedNotifs);
    } catch (error) {
      res.status(500).send('Error when adding notification to user');
    }
  };

  router.post('/addUser', addUser);
  router.post('/login', loginUser);
  router.post('/addPoints', addPoints);
  router.post('/notify', notify);

  return router;
};

export default userController;
