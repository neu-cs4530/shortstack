import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';

const fetchAllCommunitiesSpy = jest.spyOn(util, 'fetchAllCommunities');
const addQuestionToCommunityModelSpy = jest.spyOn(util, 'AddQuestionToCommunityModel');

describe('Community', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  describe('GET /communities', () => {
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
  describe('PUT /addQuestionToCommunity/:communityId', () => {
    it('should add a question to a community', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockQuestionId = new mongoose.Types.ObjectId();

      const mockUpdatedCommunity = {
        _id: mockCommunityId,
        name: 'Community 1',
        members: [],
        questions: [mockQuestionId],
        articles: [],
        polls: [],
      };

      addQuestionToCommunityModelSpy.mockResolvedValueOnce(mockUpdatedCommunity);

      const response = await supertest(app)
        .put(`/community/addQuestionToCommunity/${mockCommunityId}`)
        .send({ questionId: mockQuestionId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockUpdatedCommunity._id.toString(),
        name: mockUpdatedCommunity.name,
        members: mockUpdatedCommunity.members,
        questions: mockUpdatedCommunity.questions.map(q => q.toString()),
        articles: mockUpdatedCommunity.articles,
        polls: mockUpdatedCommunity.polls,
      });
    });
    it('should return 400 if communityId or questionId is missing', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId().toString();

      const response = await supertest(app)
        .put(`/community/addQuestionToCommunity/${mockCommunityId}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.text).toBe('Community ID and Question ID are required');
    });
    it('should return 404 if the community does not exist', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId().toString();
      const mockQuestionId = new mongoose.Types.ObjectId().toString();

      addQuestionToCommunityModelSpy.mockResolvedValueOnce({ error: 'Community not found' });

      const response = await supertest(app)
        .put(`/community/addQuestionToCommunity/${mockCommunityId}`)
        .send({ questionId: mockQuestionId });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Community not found');
    });
  });
});
