import mongoose from 'mongoose';
import supertest from 'supertest';
import * as util from '../models/application';
import { Challenge, UserChallenge } from '../types';
import { app } from '../app';

const fetchAndIncrementChallengesByUserAndTypeSpy = jest.spyOn(
  util,
  'fetchAndIncrementChallengesByUserAndType',
);

describe('PUT /progress/:challengeType/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

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
