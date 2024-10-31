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
 * Function to log in a user.
 *
 * @param credentials - The user's login credentials.
 * @throws Error if there is an issue logging in the user.
 */
const loginUser = async (credentials: { username: string; password: string }): Promise<User> => {
  const res = await api.post(`${USER_API_URL}/login`, credentials);

  if (res.status === 200) {
    return res.data;
  }
  if (res.status === 401) {
    throw new Error('Invalid username or password');
  } else if (res.status === 404) {
    throw new Error('User not found');
  } else {
    throw new Error('Error while logging in');
  }

  return res.data;
};

export { addUser, loginUser };
