import mongoose from 'mongoose';
import supertest from 'supertest';
import * as util from '../models/application';
import { Challenge, UserChallenge } from '../types';
import { app } from '../app';

const fetchAndIncrementChallengesByUserAndTypeSpy = jest.spyOn(
  util,
  'fetchAndIncrementChallengesByUserAndType',
);
const fetchUserChallengesByUsernameSpy = jest.spyOn(util, 'fetchUserChallengesByUsername');

describe('Challenge endpoints', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  describe('PUT /progress/:challengeType/:username', () => {
    it('should return a 200 response if the UserChallenges are successfully updated', async () => {
      const username = 'test username';
      const mockChallenge: Challenge = {
        _id: new mongoose.Types.ObjectId(),
        description: 'description',
        actionAmount: 5,
        challengeType: 'question',
        hoursToComplete: 24,
        reward: 'some title',
      };
      const mockUserChallengeResponse: UserChallenge[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          username,
          challenge: mockChallenge,
          progress: [new Date()],
        },
      ];

      fetchAndIncrementChallengesByUserAndTypeSpy.mockResolvedValueOnce(mockUserChallengeResponse);

      const response = await supertest(app).put(
        `/challenge/progress/${mockChallenge.challengeType}/${username}`,
      );
      expect(response.status).toEqual(200);
      expect(response.body[0]._id).toEqual(mockUserChallengeResponse[0]._id?.toString());
      expect(response.body[0].username).toEqual(mockUserChallengeResponse[0].username);
      expect(response.body[0].challenge._id).toEqual(mockChallenge._id?.toString());
      expect(response.body[0].progress[0]).toEqual(
        mockUserChallengeResponse[0].progress[0].toISOString(),
      );
    });

    it('should return a 500 error if fetchAndIncrementChallengesByUserAndType returns an error', async () => {
      const username = 'test username';
      const mockChallenge: Challenge = {
        _id: new mongoose.Types.ObjectId(),
        description: 'description',
        actionAmount: 5,
        challengeType: 'question',
        hoursToComplete: 24,
        reward: 'some title',
      };

      fetchAndIncrementChallengesByUserAndTypeSpy.mockResolvedValueOnce({ error: 'some error' });

      const response = await supertest(app).put(
        `/challenge/progress/${mockChallenge.challengeType}/${username}`,
      );

      expect(response.status).toEqual(500);
      expect(response.text).toEqual('some error');
    });
  });
  describe('GET /:username', () => {
    it('should return a 200 response with user challenges if successful', async () => {
      const username = 'test username';
      const mockChallenges: UserChallenge[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          username,
          challenge: {
            _id: new mongoose.Types.ObjectId(),
            description: 'Ask 5 questions',
            actionAmount: 5,
            challengeType: 'question',
            hoursToComplete: 24,
            reward: 'Gold Badge',
          },
          progress: [],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          username,
          challenge: {
            _id: new mongoose.Types.ObjectId(),
            description: 'Answer 3 questions',
            actionAmount: 3,
            challengeType: 'answer',
            hoursToComplete: 48,
            reward: 'Silver Badge',
          },
          progress: [new Date()],
        },
      ];

      fetchUserChallengesByUsernameSpy.mockResolvedValueOnce(mockChallenges);

      const response = await supertest(app).get(`/challenge/${username}`);
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].username).toEqual(username);
      expect(response.body[0].challenge.description).toEqual('Ask 5 questions');
      expect(response.body[1].challenge.description).toEqual('Answer 3 questions');
    });

    it('should return a 500 error if fetchUserChallengesByUsername returns an error', async () => {
      const username = 'test username';

      fetchUserChallengesByUsernameSpy.mockResolvedValueOnce({
        error: 'Error fetching challenges',
      });

      const response = await supertest(app).get(`/challenge/${username}`);
      expect(response.status).toEqual(500);
      expect(response.text).toEqual('Error fetching challenges');
    });
  });
});
