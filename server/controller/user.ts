import express, { Response } from 'express';
import { AddPointsRequest, AddUserRequest, FakeSOSocket, User } from '../types';
import { findUser, saveUser, addPointsToUser } from '../models/application';

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
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.password !== password) {
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error while logging in' });
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

  router.post('/addUser', addUser);
  router.post('/login', loginUser);
  router.post('/addPoints', addPoints);

  return router;
};

export default userController;
