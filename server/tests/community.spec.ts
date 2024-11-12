import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Community, User } from '../types';

const fetchAllCommunitiesSpy = jest.spyOn(util, 'fetchAllCommunities');
const addQuestionToCommunityModelSpy = jest.spyOn(util, 'AddQuestionToCommunityModel');
const addUserToCommunitySpy = jest.spyOn(util, 'addUserToCommunity');
const populateCommunitySpy = jest.spyOn(util, 'populateCommunity');

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

      const response = await supertest(app).get('/community/getCommunity');

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

      const response = await supertest(app).get('/community/getCommunity');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should handle error when fetching communities', async () => {
      fetchAllCommunitiesSpy.mockResolvedValueOnce({ error: 'Error fetching communities' });

      const response = await supertest(app).get('/community/getCommunity');

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
  describe('PUT /joinCommunity', () => {
    it('should return 200 status if the user is successfully added to the community', async () => {
      const userObjectID = new mongoose.Types.ObjectId();
      const userIDString = userObjectID.toString();
      const mockCommunity: Community = {
        _id: new mongoose.Types.ObjectId(),
        name: 'TestCommunity',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      };
      const mockUser: User = {
        _id: userObjectID,
        username: 'username',
        password: 'password',
        totalPoints: 0,
        unlockedFrames: [],
        unlockedTitles: [],
        equippedFrame: '',
        equippedTitle: '',
        notifications: [],
      };
      const mockPopulatedCommunity: Community = {
        _id: mockCommunity._id,
        name: 'TestCommunity',
        members: [mockUser],
        questions: [],
        articles: [],
        polls: [],
      };

      addUserToCommunitySpy.mockResolvedValueOnce(mockCommunity);
      populateCommunitySpy.mockResolvedValueOnce(mockPopulatedCommunity);

      const response = await supertest(app).put(
        `/community/joinCommunity/${mockCommunity._id?.toString()}/${userIDString}`,
      );

      expect(response.status).toBe(200);
    });

    it('should return 404 error if the addUserToCommunity returns null', async () => {
      const userObjectID = new mongoose.Types.ObjectId();
      const communityID = new mongoose.Types.ObjectId().toString();
      const userIDString = userObjectID.toString();

      addUserToCommunitySpy.mockResolvedValueOnce(null);

      const response = await supertest(app).put(
        `/community/joinCommunity/${communityID}/${userIDString}`,
      );

      expect(response.status).toBe(404);
      expect(response.text).toBe('Community or User not found');
    });

    it('should return 500 error if addUserToCommunity returns an error', async () => {
      const userObjectID = new mongoose.Types.ObjectId();
      const communityID = new mongoose.Types.ObjectId().toString();
      const userIDString = userObjectID.toString();

      addUserToCommunitySpy.mockResolvedValueOnce({
        error: 'Some error occurred during addUserToCommunity.',
      });

      const response = await supertest(app).put(
        `/community/joinCommunity/${communityID}/${userIDString}`,
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe('Some error occurred during addUserToCommunity.');
    });

    it('should return 500 error if populateCommunity returns an error', async () => {
      const userObjectID = new mongoose.Types.ObjectId();
      const userIDString = userObjectID.toString();
      const mockCommunity: Community = {
        _id: new mongoose.Types.ObjectId(),
        name: 'TestCommunity',
        members: [],
        questions: [],
        articles: [],
        polls: [],
      };

      addUserToCommunitySpy.mockResolvedValueOnce(mockCommunity);
      populateCommunitySpy.mockResolvedValueOnce({
        error: 'Some error occurred during populateCommunity.',
      });

      const response = await supertest(app).put(
        `/community/joinCommunity/${mockCommunity._id?.toString()}/${userIDString}`,
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe('Some error occurred during populateCommunity.');
    });
  });
});
