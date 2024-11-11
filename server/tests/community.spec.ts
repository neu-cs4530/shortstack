import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';

const fetchAllCommunitiesSpy = jest.spyOn(util, 'fetchAllCommunities');

describe('GET /communities', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a list of communities', async () => {
    const mockCommunities = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Community 1',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Community 2',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      },
    ];

    fetchAllCommunitiesSpy.mockResolvedValueOnce(mockCommunities);

    const response = await supertest(app).get('/community/communities');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      mockCommunities.map(community => ({
        _id: community._id.toString(),
        name: community.name,
        members: community.members,
        questions: community.questions,
        articles: community.articles,
        polls: community.polls,
      })),
    );
  });

  it('should return an empty array if no communities are found', async () => {
    fetchAllCommunitiesSpy.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/community/communities');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should handle error when fetching communities', async () => {
    fetchAllCommunitiesSpy.mockResolvedValueOnce({ error: 'Error fetching communities' });

    const response = await supertest(app).get('/community/communities');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching communities');
  });
});
