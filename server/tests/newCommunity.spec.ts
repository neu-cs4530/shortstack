import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';

const saveCommunitySpy = jest.spyOn(util, 'saveCommunity');
const popCommunitySpy = jest.spyOn(util, 'populateCommunity');

describe('POST /addCommunity', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new Community', async () => {
    const mockReqBody = {
      community: {
        name: 'A Test Community',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      },
    };

    const validCID = new mongoose.Types.ObjectId();

    const mockCommunity = {
      _id: validCID,
      name: 'A Test Community',
      members: [],
      questions: [],
      articles: [],
      polls: [],
    };
    saveCommunitySpy.mockResolvedValueOnce(mockCommunity);

    popCommunitySpy.mockResolvedValueOnce({
      _id: validCID,
      name: 'A Test Community',
      members: [],
      questions: [],
      articles: [],
      polls: [],
    });

    const response = await supertest(app).post('/community/addCommunity').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validCID.toString(),
      name: 'A Test Community',
      members: [],
      questions: [],
      articles: [],
      polls: [],
    });
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/community/addCommunity');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if community object has name property missing', async () => {
    const mockReqBody = {
      userID: 'valid user id',
      community: {
        questions: [],
        articles: [],
        polls: [],
      },
    };

    const response = await supertest(app).post('/community/addCommunity').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid community');
  });

  it('should return bad request error if community object has members property missing', async () => {
    const mockReqBody = {
      userID: 'valid user id',
      community: {
        name: 'This is a test community',
        questions: [],
        articles: [],
        polls: [],
      },
    };

    const response = await supertest(app).post('/community/addCommunity').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid community');
  });

  it('should return bad request error if community object has questions property missing', async () => {
    const mockReqBody = {
      userID: 'valid user id',
      community: {
        name: 'This is a test community',
        members: [],
        articles: [],
        polls: [],
      },
    };

    const response = await supertest(app).post('/community/addCommunity').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid community');
  });

  it('should return database error in response if saveCommunity method throws an error', async () => {
    const mockReqBody = {
      userID: 'valid user id',
      community: {
        name: 'This is a test community',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      },
    };

    saveCommunitySpy.mockResolvedValueOnce({ error: 'Error when saving a community' });

    const response = await supertest(app).post('/community/addCommunity').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving community: Error when saving a community');
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const mockReqBody = {
      userID: 'valid user id',
      community: {
        name: 'This is a test community',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      },
    };

    const mockCommunity = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      name: 'This is a test community',
      members: [],
      questions: [],
      articles: [],
      polls: [],
    };

    saveCommunitySpy.mockResolvedValueOnce(mockCommunity);
    popCommunitySpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/community/addCommunity').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving community: Error when populating document');
  });
});
