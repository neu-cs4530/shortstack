import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Function to add a new user.
 *
 * @param u - The user object to add.
 * @throws Error if there is an issue creating the new user.
 */
const addUser = async (u: User): Promise<User> => {
  const res = await api.post(`${USER_API_URL}/addUser`, u);

  if (res.status !== 200) {
    throw new Error('Error while creating a new user');
  }

  return res.data;
};

/**
 * Function to add points to a user.
 *
 * @param username - The username of the user to add points to.
 * @param numPoints - The number of points to add.
 * @throws Error if there is an issue adding the points.
 */
const addPoints = async (username: string, numPoints: number): Promise<User> => {
  const data = { username, numPoints };
  const res = await api.post(`${USER_API_URL}/addPoints`, data);

  if (res.status !== 200) {
    throw new Error('Error while adding points to user');
  }

  return res.data;
};

export { addUser, addPoints };
