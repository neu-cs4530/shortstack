import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Article, Community, CommunityObjectType } from '../types';

const fetchAllCommunitiesSpy = jest.spyOn(util, 'fetchAllCommunities');
const addQuestionToCommunityModelSpy = jest.spyOn(util, 'AddQuestionToCommunityModel');
const addUserToCommunitySpy = jest.spyOn(util, 'addUserToCommunity');
const populateCommunitySpy = jest.spyOn(util, 'populateCommunity');
const fetchCommunityMembersByObjectIdSpy = jest.spyOn(util, 'fetchCommunityMembersByObjectId');
const saveAndAddArticleToCommunitySpy = jest.spyOn(util, 'saveAndAddArticleToCommunity');
const saveAndAddPollToCommunitySpy = jest.spyOn(util, 'saveAndAddPollToCommunity');

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
  describe('GET /getCommunityById/:communityId', () => {
    it('should return the community details when given a valid community ID', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId().toString();
      const mockCommunity: Community = {
        _id: new mongoose.Types.ObjectId(mockCommunityId),
        name: 'Test Community',
        members: ['user1', 'user2'],
        questions: [],
        articles: [],
        polls: [],
      };

      populateCommunitySpy.mockResolvedValueOnce(mockCommunity);

      const response = await supertest(app).get(`/community/getCommunityById/${mockCommunityId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockCommunity._id?.toString(),
        name: mockCommunity.name,
        members: mockCommunity.members,
        questions: mockCommunity.questions,
        articles: mockCommunity.articles,
        polls: mockCommunity.polls,
      });
    });
    it('should return a 500 status if the community is not found', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId().toString();

      populateCommunitySpy.mockResolvedValueOnce({ error: 'Community not found' });

      const response = await supertest(app).get(`/community/getCommunityById/${mockCommunityId}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching community details');
    });
    it('should return a 500 status if an error occurs while fetching community details', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId().toString();

      populateCommunitySpy.mockRejectedValueOnce(new Error('Error fetching community details'));

      const response = await supertest(app).get(`/community/getCommunityById/${mockCommunityId}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching community details');
    });
  });
  describe('PUT /addQuestionToCommunity/:communityId', () => {
    it('should successfully add a question to a community and return the updated question', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockQuestionId = new mongoose.Types.ObjectId();

      const mockCommunity: Community = {
        _id: mockCommunityId,
        name: 'Test Community',
        members: ['user1', 'user2'],
        questions: [mockQuestionId],
        polls: [],
        articles: [],
      };

      const mockUpdatedQuestion = {
        _id: mockQuestionId,
        title: 'Mock Title',
        text: 'Sample Question',
        tags: [
          { _id: new mongoose.Types.ObjectId(), name: 'tag1', description: 'Tag 1 description' },
          { _id: new mongoose.Types.ObjectId(), name: 'tag2', description: 'Tag 2 description' },
        ],
        answers: [],
        askedBy: 'user123',
        askDateTime: new Date(),
        views: ['user1', 'user2'],
        upVotes: ['user3'],
        downVotes: ['user4'],
        comments: [new mongoose.Types.ObjectId()],
        subscribers: ['user5', 'user6'],
        community: mockCommunity,
      };

      addQuestionToCommunityModelSpy.mockResolvedValueOnce(mockUpdatedQuestion);

      const response = await supertest(app)
        .put(`/community/addQuestionToCommunity/${mockCommunityId.toString()}`)
        .send({ questionId: mockQuestionId.toString() });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockUpdatedQuestion,
        _id: mockUpdatedQuestion._id.toString(),
        tags: mockUpdatedQuestion.tags.map(tag => ({
          ...tag,
          _id: tag._id.toString(),
        })),
        comments: mockUpdatedQuestion.comments.map(comment => comment.toString()),
        askDateTime: mockUpdatedQuestion.askDateTime.toISOString(),
        community: {
          ...mockCommunity,
          _id: mockCommunity._id?.toString(),
          questions: mockCommunity.questions.map(q => q.toString()),
          polls: mockCommunity.polls.map(p => p.toString()),
          articles: mockCommunity.articles.map(a => a.toString()),
        },
      });
      expect(addQuestionToCommunityModelSpy).toHaveBeenCalledWith(
        mockCommunityId.toString(),
        mockQuestionId.toString(),
      );
    });
    it('should return 404 if the community is not found', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId().toString();
      const mockQuestionId = new mongoose.Types.ObjectId().toString();

      addQuestionToCommunityModelSpy.mockResolvedValueOnce({ error: 'Community not found' });

      const response = await supertest(app)
        .put(`/community/addQuestionToCommunity/${mockCommunityId}`)
        .send({ questionId: mockQuestionId });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Community not found');
      expect(addQuestionToCommunityModelSpy).toHaveBeenCalledWith(mockCommunityId, mockQuestionId);
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
      const mockPopulatedCommunity: Community = {
        _id: mockCommunity._id,
        name: 'TestCommunity',
        members: ['username'],
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

  describe('GET /getMembers', () => {
    it('should return a list of usernames if fetchCommunityMembersByObjectId is successful', async () => {
      const oid: string = new mongoose.Types.ObjectId().toString();
      const objectType: CommunityObjectType = 'Question';

      fetchCommunityMembersByObjectIdSpy.mockResolvedValueOnce([
        'user1',
        'user2',
        'user3',
        'user4',
      ]);

      const response = await supertest(app).get(`/community/getMembers/${oid}/${objectType}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });

    it('should return a 500 status if fetchCommunityMembersByObjectId throws an error', async () => {
      const oid: string = new mongoose.Types.ObjectId().toString();
      const objectType: CommunityObjectType = 'Question';

      fetchCommunityMembersByObjectIdSpy.mockRejectedValueOnce(new Error('error'));

      const response = await supertest(app).get(`/community/getMembers/${oid}/${objectType}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('error');
    });
  });

  describe('POST /addArticle/:communityId', () => {
    it('should return the saved article if the operation is successful', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockArticleBody = {
        article: {
          title: 'Title',
          body: 'Body',
        },
      };
      const expectedArticle: Article = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Title',
        body: 'Body',
      };

      saveAndAddArticleToCommunitySpy.mockResolvedValueOnce(expectedArticle);

      const response = await supertest(app)
        .post(`/community/addArticle/${mockCommunityId.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(expectedArticle._id?.toString());
      expect(response.body.title).toEqual(expectedArticle.title);
      expect(response.body.body).toEqual(expectedArticle.body);
    });
    it('should return a 400 status if the article is invalid', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockArticleBody = {
        article: {
          title: 'Title',
        },
      };

      const response = await supertest(app)
        .post(`/community/addArticle/${mockCommunityId.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request body');
    });
    it('should return a 500 status if saveAndAddArticleToCommunity returns an error', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockArticleBody = {
        article: {
          title: 'Title',
          body: 'Body',
        },
      };

      saveAndAddArticleToCommunitySpy.mockResolvedValueOnce({ error: 'error' });

      const response = await supertest(app)
        .post(`/community/addArticle/${mockCommunityId.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(500);
      expect(response.text).toBe('error');
    });
  });
  describe('POST /addPoll/:communityId', () => {
    it('should return the saved poll if the operation is successful', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockPollBody = {
        poll: {
          title: 'Poll Title',
          options: [{ text: 'Option 1' }, { text: 'Option 2' }],
        },
      };
      const expectedPoll = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Poll Title',
        options: [
          { _id: new mongoose.Types.ObjectId(), text: 'Option 1', usersVoted: [] },
          { _id: new mongoose.Types.ObjectId(), text: 'Option 2', usersVoted: [] },
        ],
        createdBy: 'user123',
        pollDateTime: new Date(),
        pollDueDate: new Date(),
      };

      saveAndAddPollToCommunitySpy.mockResolvedValueOnce(expectedPoll);

      const response = await supertest(app)
        .post(`/community/addPoll/${mockCommunityId.toString()}`)
        .send(mockPollBody);

      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(expectedPoll._id?.toString());
      expect(response.body.title).toEqual(expectedPoll.title);
      expect(response.body.options.length).toEqual(expectedPoll.options.length);
      expect(response.body.options[0].text).toEqual(expectedPoll.options[0].text);
      expect(response.body.options[1].text).toEqual(expectedPoll.options[1].text);
    });

    it('should return a 400 status if the poll is invalid', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockPollBody = {
        poll: {
          title: 'Poll Title',
        },
      };

      const response = await supertest(app)
        .post(`/community/addPoll/${mockCommunityId.toString()}`)
        .send(mockPollBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request body');
    });

    it('should return a 500 status if saveAndAddPollToCommunity returns an error', async () => {
      const mockCommunityId = new mongoose.Types.ObjectId();
      const mockPollBody = {
        poll: {
          title: 'Poll Title',
          options: [{ text: 'Option 1' }, { text: 'Option 2' }],
        },
      };

      saveAndAddPollToCommunitySpy.mockResolvedValueOnce({ error: 'error' });

      const response = await supertest(app)
        .post(`/community/addPoll/${mockCommunityId.toString()}`)
        .send(mockPollBody);

      expect(response.status).toBe(500);
      expect(response.text).toBe('error');
    });
  });
});
