import mongoose from 'mongoose';
import supertest from 'supertest';
import * as util from '../models/application';
import { app } from '../app';
import { Poll } from '../types';

const fetchPollByIdSpy = jest.spyOn(util, 'fetchPollById');

describe('Poll API', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  describe('GET /pollById/:pollId', () => {
    it('should return the poll if it exists', async () => {
      const mockPollID = new mongoose.Types.ObjectId();
      const mockPoll: Poll = {
        _id: mockPollID,
        title: 'Poll',
        options: [
          {
            text: 'Option',
            usersVoted: ['me', 'you'],
          },
        ],
        createdBy: 'us',
        pollDateTime: new Date(),
        pollDueDate: new Date(),
      };

      fetchPollByIdSpy.mockResolvedValueOnce(mockPoll);

      const response = await supertest(app).get(`/poll/getPollById/${mockPollID}`);

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(mockPollID.toString());
    });
    it('should return a 500 status if the operation fails', async () => {
      const mockPollID = new mongoose.Types.ObjectId();

      fetchPollByIdSpy.mockResolvedValueOnce({ error: 'error' });

      const response = await supertest(app).get(`/poll/getPollById/${mockPollID}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('error');
    });
  });
});
