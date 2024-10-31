import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');
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

describe('POST /addUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

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

describe('POST /addPoints', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the user with points added', async () => {
    jest.clearAllMocks();
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
});
