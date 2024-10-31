import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const findUserSpy = jest.spyOn(util, 'findUser');
const addPointsToUserSpy = jest.spyOn(util, 'addPointsToUser');

const newUser: User = {
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [],
};

const mockNewUser: User = {
  _id: new mongoose.Types.ObjectId(),
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [],
};

describe('User API', () => {
  afterEach(async () => {
    jest.resetAllMocks();
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('POST /addUser', () => {
    it('should add a new user', async () => {
      saveUserSpy.mockResolvedValueOnce(mockNewUser);
      // Making the request
      const response = await supertest(app).post('/user/addUser').send(newUser);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockNewUser._id?.toString(),
        ...newUser,
      });
    });

    it('should return bad request if user is missing username', async () => {
      const invalidUser = {
        password: 'abc123',
      } as User;
      // Making the request
      const response = await supertest(app).post('/user/addUser').send(invalidUser);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if user is missing password', async () => {
      const invalidUser = {
        username: 'user12345',
      } as User;
      // Making the request
      const response = await supertest(app).post('/user/addUser').send(invalidUser);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return 500 if error occurs in `saveUser` while adding user', async () => {
      saveUserSpy.mockResolvedValueOnce({ error: 'Error saving user' });
      // Making the request
      const response = await supertest(app).post('/user/addUser').send(newUser);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user', async () => {
      findUserSpy.mockResolvedValueOnce(mockNewUser);
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: newUser.username,
        password: newUser.password,
      });

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockNewUser._id?.toString(),
        ...newUser,
      });
    });

    it('should return 404 if user is not found', async () => {
      findUserSpy.mockResolvedValueOnce(null);
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: 'fakeUser',
        password: 'abc123',
      });

      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
      findUserSpy.mockResolvedValueOnce({ ...mockNewUser, password: 'wrongPassword' });
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: newUser.username,
        password: 'invalidPassword',
      });

      // Asserting the response
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid password');
    });

    it('should return 500 if error occurs during login', async () => {
      findUserSpy.mockRejectedValueOnce(new Error('Error finding user'));
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: newUser.username,
        password: newUser.password,
      });

      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error while logging in');
    });
  });

  describe('POST /addPoints', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });

    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });

    it('should return the user with points added', async () => {
      const mockReqBody = {
        username: 'UserA',
        numPoints: 10,
      };
      addPointsToUserSpy.mockResolvedValueOnce({ ...mockNewUser, totalPoints: 10 });
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockNewUser._id?.toString(),
        ...newUser,
        totalPoints: 10,
      });
    });

    it('should return bad request if missing username', async () => {
      const mockReqBody = {
        numPoints: 10,
      };
      addPointsToUserSpy.mockResolvedValueOnce(mockNewUser);
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if missing number of points to add', async () => {
      const mockReqBody = {
        username: 'UserA',
      };
      addPointsToUserSpy.mockResolvedValueOnce(mockNewUser);
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return 500 if error object returned by `addPointsToUser`', async () => {
      const mockReqBody = {
        username: 'UserA',
        numPoints: 10,
      };
      addPointsToUserSpy.mockResolvedValueOnce({ error: 'Error when adding points to a user' });
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });
});
