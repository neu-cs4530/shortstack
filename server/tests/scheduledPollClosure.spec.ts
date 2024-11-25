import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';
import scheduledPollClosure from '../jobs/scheduledPollClosure';
import { Poll } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const application = require('../models/application');

class FakeSOSocket extends Server {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }
}

const expiredPoll1: Poll = {
  _id: new ObjectId(),
  title: 'Test Title',
  options: [],
  createdBy: 'testUser1',
  pollDateTime: new Date('01-01-2023'),
  pollDueDate: new Date('01-01-2023'),
  isClosed: false,
};

const expiredPoll2: Poll = {
  _id: new ObjectId(),
  title: 'Test Title',
  options: [],
  createdBy: 'testUser2',
  pollDateTime: new Date('01-01-2023'),
  pollDueDate: new Date('01-01-2023'),
  isClosed: false,
};

describe('Cron scheduledPollClosure job', () => {
  let closeExpiredPollsSpy: jest.SpyInstance;
  let notifyUsersSpy: jest.SpyInstance;

  beforeEach(() => {
    closeExpiredPollsSpy = jest.spyOn(application, 'closeExpiredPolls');
    notifyUsersSpy = jest.spyOn(application, 'notifyUsers');
  });

  afterEach(() => jest.clearAllMocks());

  test('should close any expired polls and add notifications to users', async () => {
    closeExpiredPollsSpy.mockResolvedValueOnce([expiredPoll1, expiredPoll2]);
    notifyUsersSpy.mockResolvedValueOnce(['testUser1']);
    notifyUsersSpy.mockResolvedValueOnce(['testUser2']);

    await scheduledPollClosure(new FakeSOSocket());

    expect(closeExpiredPollsSpy).toHaveBeenCalled();
    expect(notifyUsersSpy).toHaveBeenCalledTimes(2);
  });

  test('should not notify any users if no polls have been closed', async () => {
    closeExpiredPollsSpy.mockResolvedValueOnce([]);

    await scheduledPollClosure(new FakeSOSocket());

    expect(closeExpiredPollsSpy).toHaveBeenCalled();
    expect(notifyUsersSpy).toHaveBeenCalledTimes(0);
  });

  test('should throw an error if error message returned by `closeExpiredPolls`', async () => {
    closeExpiredPollsSpy.mockResolvedValueOnce({ error: 'Error closing polls' });

    try {
      await scheduledPollClosure(new FakeSOSocket());
      expect(false).toBeTruthy();
    } catch (error) {
      expect(true).toBeTruthy();
    }
  });

  test('should throw an error if error message returned by `notifyUsers`', async () => {
    closeExpiredPollsSpy.mockResolvedValueOnce([expiredPoll1]);
    notifyUsersSpy.mockResolvedValueOnce({ error: 'Error notifying users' });

    try {
      await scheduledPollClosure(new FakeSOSocket());
      expect(false).toBeTruthy();
    } catch (error) {
      expect(true).toBeTruthy();
    }
  });

  test('should throw an error if error message returned by any calls to `notifyUsers`', async () => {
    closeExpiredPollsSpy.mockResolvedValueOnce([expiredPoll1, expiredPoll2]);
    notifyUsersSpy.mockResolvedValueOnce(['testUser1']);
    notifyUsersSpy.mockResolvedValueOnce({ error: 'Error notifying users' });

    try {
      await scheduledPollClosure(new FakeSOSocket());
      expect(false).toBeTruthy();
    } catch (error) {
      expect(true).toBeTruthy();
    }
  });
});
