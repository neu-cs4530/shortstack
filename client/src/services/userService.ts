import { Notification, User } from '../types';
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

/**
 * Function to send a notification. The users to add the notification to are determined by the
 * type of the notification and the given ObjectID.
 *
 * - Answer : Given Question ID, notify question.askedBy and question subscribers.
 * - Comment : Given Question ID, notify question.askedBy.
 * - AnswerComment : Given Answer ID, notify answer.ansBy
 * - Upvote : Given Question ID, notify question.askedBy.
 * - NewQuestion : Given Question ID, notify members of the community the question was posted in.
 * - NewPoll : Given Poll ID, notify members of the community the poll was posted in.
 * - PollClosed : Given Poll ID, notify poll.createdBy and users who voted in the poll.
 * - NewArticle : Given Article ID, notify members of the community the article was posted in.
 * - ArticleUpdate : Given Article ID, notify members of the community the article was posted in.
 * - NewReward : Given User ID, notify the user.
 *
 * @param oid - The ObjectID used to determine what user's to add the new notification to.
 * @param notif - The notification to add.
 * @throws Error if there is an issue adding the notification.
 */
const notifyUsers = async (oid: string, notif: Notification): Promise<User> => {
  const data = { oid, notification: notif };
  const res = await api.post(`${USER_API_URL}/notify`, data);

  if (res.status !== 200) {
    throw new Error('Error while adding notification to user');
  }

  return res.data;
};

/**
 * @param username - the username of the user whose notifications we want to fetch.
 * @returns the promise of an array of Notifications for the given user.
 * @throws Error if there is an issue fetching the notifications with the given username.
 */
const getUserNotifications = async (username: string): Promise<Notification[]> => {
  const res = await api.get(`${USER_API_URL}/getUserNotifications/${username}`);
  if (res.status !== 200) {
    throw new Error(`Error when fetching notifications for user: ${username}`);
  }
  return res.data;
};

export { addUser, loginUser, addPoints, notifyUsers, getUserNotifications };
