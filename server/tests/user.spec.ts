import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Article, FRAMES, Notification, NotificationType, Poll, User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const findUserSpy = jest.spyOn(util, 'findUser');
const addPointsToUserSpy = jest.spyOn(util, 'addPointsToUser');
const updateUsersUnlockedFramesSpy = jest.spyOn(util, 'updateUsersUnlockedFrames');
const equipRewardSpy = jest.spyOn(util, 'equipReward');
const usersToNotifySpy = jest.spyOn(util, 'usersToNotify');
const saveNotificationSpy = jest.spyOn(util, 'saveNotification');
const addNotificationToUserSpy = jest.spyOn(util, 'addNotificationToUser');
const notifyUsersSpy = jest.spyOn(util, 'notifyUsers');
const updateUserNotifsAsReadSpy = jest.spyOn(util, 'updateUserNotifsAsRead');
const updateBlockedTypesSpy = jest.spyOn(util, 'updateBlockedTypes');

const newUser: User = {
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [],
  blockedNotifications: [],
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
  blockedNotifications: [],
};

const mockRewardNotif: Notification = {
  _id: new mongoose.Types.ObjectId(),
  notificationType: NotificationType.NewReward,
  isRead: false,
};

const mockPollNotif: Notification = {
  _id: new ObjectId('672e29e54e42e9c421fc2f7c'),
  notificationType: NotificationType.PollClosed,
  sourceType: 'Poll',
  source: { _id: new ObjectId('672e289cee67e0b36e0ef440') } as Poll,
  isRead: false,
};

const mockNewUserWithNotif: User = {
  _id: new mongoose.Types.ObjectId(),
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [mockRewardNotif],
  blockedNotifications: [],
};

const mockUserWithEquippedRewards: User = {
  _id: new mongoose.Types.ObjectId(),
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: ['profile_frames-01.png', 'profile_frames-02.png'],
  unlockedTitles: ['Curious Explorer'],
  equippedFrame: 'profile_frames-02.png',
  equippedTitle: 'Curious Explorer',
  notifications: [],
  blockedNotifications: [],
};

describe('User API', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('POST /addUser', () => {
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

  describe('POST /login', () => {
    it('should log in an existing user', async () => {
      findUserSpy.mockResolvedValueOnce(mockNewUser);
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: newUser.username,
        password: newUser.password,
      });

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockNewUser._id?.toString(),
        ...newUser,
      });
    });

    it('should return 404 if user is not found', async () => {
      findUserSpy.mockResolvedValueOnce(null);
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: 'fakeUser',
        password: 'abc123',
      });

      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
      findUserSpy.mockResolvedValueOnce({ ...mockNewUser, password: 'wrongPassword' });
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: newUser.username,
        password: 'invalidPassword',
      });

      // Asserting the response
      expect(response.status).toBe(401);
      expect(response.text).toBe('Invalid password');
    });

    it('should return 500 if error occurs during login', async () => {
      findUserSpy.mockRejectedValueOnce(new Error('Error finding user'));
      // Making the request
      const response = await supertest(app).post('/user/login').send({
        username: newUser.username,
        password: newUser.password,
      });

      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.text).toBe('Error while logging in');
    });
  });

  describe('POST /addPoints', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });

    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });

    it('should return the user with points added when no frame is unlocked', async () => {
      const mockReqBody = {
        username: 'UserA',
        numPoints: 5,
      };
      addPointsToUserSpy.mockResolvedValueOnce({ ...mockNewUser, totalPoints: 5 });
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockNewUser._id?.toString(),
        ...newUser,
        totalPoints: 5,
      });
    });

    it('should return the user with points and updated unlocked frames when frame is unlocked', async () => {
      const mockReqBody = {
        username: 'UserA',
        numPoints: FRAMES[0].pointsNeeded,
      };

      addPointsToUserSpy.mockResolvedValueOnce({
        ...mockNewUser,
        totalPoints: FRAMES[0].pointsNeeded,
      });
      updateUsersUnlockedFramesSpy.mockResolvedValueOnce({
        ...mockNewUser,
        totalPoints: FRAMES[0].pointsNeeded,
        unlockedFrames: [FRAMES[0].name],
      });

      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(updateUsersUnlockedFramesSpy).toHaveBeenCalledWith('UserA', [FRAMES[0].name]);
      expect(response.body).toEqual({
        _id: mockNewUser._id?.toString(),
        ...newUser,
        totalPoints: FRAMES[0].pointsNeeded,
        unlockedFrames: [FRAMES[0].name],
      });
    });

    it('should return bad request if missing username', async () => {
      const mockReqBody = {
        numPoints: 10,
      };
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if missing number of points to add', async () => {
      const mockReqBody = {
        username: 'UserA',
      };
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return 500 if error object returned by `addPointsToUser`', async () => {
      const mockReqBody = {
        username: 'UserA',
        numPoints: 10,
      };
      addPointsToUserSpy.mockResolvedValueOnce({ error: 'Error when adding points to a user' });
      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if error object returned by `updateUsersUnlockedFrames`', async () => {
      const mockReqBody = {
        username: 'UserA',
        numPoints: FRAMES[0].pointsNeeded,
      };

      addPointsToUserSpy.mockResolvedValueOnce({
        ...mockNewUser,
        totalPoints: FRAMES[0].pointsNeeded,
      });
      updateUsersUnlockedFramesSpy.mockResolvedValueOnce({ error: 'error updating frames' });

      // Making the request
      const response = await supertest(app).post('/user/addPoints').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /updateEquippedReward', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });

    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });

    it('should return the username, updated reward, and reward type that was added for type frame', async () => {
      const mockReqBody = {
        username: 'UserA',
        reward: 'profile_frames-01.png',
        type: 'frame',
      };
      equipRewardSpy.mockResolvedValueOnce({
        username: 'UserA',
        reward: 'profile_frames-01.png',
        type: 'frame',
      });
      // Making the request
      const response = await supertest(app).put('/user/updateEquippedReward').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        username: 'UserA',
        reward: 'profile_frames-01.png',
        type: 'frame',
      });
    });

    it('should return the username, updated reward, and reward type that was added for type title', async () => {
      const mockReqBody = {
        username: 'UserA',
        reward: 'Rookie Responder',
        type: 'title',
      };
      equipRewardSpy.mockResolvedValueOnce({
        username: 'UserA',
        reward: 'Rookie Responder',
        type: 'title',
      });
      // Making the request
      const response = await supertest(app).put('/user/updateEquippedReward').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        username: 'UserA',
        reward: 'Rookie Responder',
        type: 'title',
      });
    });

    it('should return bad request if missing username', async () => {
      const mockReqBody = {
        reward: 'profile_frames-01.png',
        type: 'frame',
      };
      // Making the request
      const response = await supertest(app).put('/user/updateEquippedReward').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if missing reward to equip', async () => {
      const mockReqBody = {
        username: 'UserA',
        type: 'frame',
      };
      // Making the request
      const response = await supertest(app).put('/user/updateEquippedReward').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if missing type of reward to equip', async () => {
      const mockReqBody = {
        username: 'UserA',
        reward: 'profile_frames-01.png',
      };
      // Making the request
      const response = await supertest(app).put('/user/updateEquippedReward').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return 500 if error object returned by `equipReward`', async () => {
      const mockReqBody = {
        username: 'UserA',
        reward: 'profile_frames-01.png',
        type: 'frame',
      };
      equipRewardSpy.mockResolvedValueOnce({ error: 'Error equipping reward' });
      // Making the request
      const response = await supertest(app).put('/user/updateEquippedReward').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });

  describe('POST /notify', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });

    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });

    it('should return the notification that was added', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      usersToNotifySpy.mockResolvedValueOnce(['UserA']);
      saveNotificationSpy.mockResolvedValueOnce(mockPollNotif);
      addNotificationToUserSpy.mockResolvedValueOnce({
        ...mockNewUser,
        notifications: [mockPollNotif],
      });
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual('UserA');
    });

    it('should return the notifications that were added if multiple users to be notified', async () => {
      const mockPollNotifB = {
        ...mockPollNotif,
        _id: new ObjectId('672e29e54e42e9c421fc2f7e'),
      };
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      usersToNotifySpy.mockResolvedValueOnce(['UserA', 'UserB']);
      saveNotificationSpy.mockResolvedValueOnce(mockPollNotif);
      saveNotificationSpy.mockResolvedValueOnce(mockPollNotifB);
      addNotificationToUserSpy.mockResolvedValueOnce({
        ...mockNewUser,
        notifications: [mockPollNotif],
      });
      addNotificationToUserSpy.mockResolvedValueOnce({
        ...mockNewUser,
        notifications: [mockPollNotifB],
      });
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toContain('UserA');
      expect(response.body).toContain('UserB');
    });

    it('should return bad request if missing oid', async () => {
      const mockReqBody = {
        notification: mockPollNotif,
      };
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if missing notification to add', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
      };
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if notification to add missing required isRead', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: {
          notificationType: NotificationType.PollClosed,
        }, // missing required isRead
      };
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if notification to add missing required notificationType', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: {
          isRead: true,
        }, // missing required notificationType
      };
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if notification to add has sourceType, missing source', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: {
          notificationType: NotificationType.ArticleUpdate,
          sourceType: 'Question',
          isRead: true,
        }, // must have source and sourceType
      };
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if notification to add has source, missing sourceType', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: {
          notificationType: NotificationType.ArticleUpdate,
          source: { _id: new ObjectId('672e289cee67e0b36e0ef440') } as Article,
          isRead: true,
        }, // must have source and sourceType
      };
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return 500 if empty list returned by `usersToNotify`', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      usersToNotifySpy.mockResolvedValueOnce([]);
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if error object returned by `usersToNotify`', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      usersToNotifySpy.mockResolvedValueOnce({ error: 'Error when finding users' });
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if error object returned by `saveNotification`', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      usersToNotifySpy.mockResolvedValueOnce(['UserA']);
      saveNotificationSpy.mockResolvedValueOnce({
        error: 'Error when saving notification',
      });
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if error object returned by `addNotificationToUser`', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      usersToNotifySpy.mockResolvedValueOnce(['UserA']);
      saveNotificationSpy.mockResolvedValueOnce(mockPollNotif);
      addNotificationToUserSpy.mockResolvedValueOnce({
        error: 'Error when adding notification to a user',
      });
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });

    it('should return 500 if error object returned by `notifyUsers`', async () => {
      const mockReqBody = {
        oid: '672e289cee67e0b36e0ef440',
        notification: mockPollNotif,
      };
      notifyUsersSpy.mockResolvedValueOnce({ error: 'Error notifying users' });
      // Making the request
      const response = await supertest(app).post('/user/notify').send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });

  describe('GET /getUserNotifications/:username', () => {
    it('should return an array of Notifications when given a valid username', async () => {
      findUserSpy.mockResolvedValueOnce(mockNewUserWithNotif);
      const response = await supertest(app).get(
        `/user/getUserNotifications/${mockNewUserWithNotif.username}`,
      );

      expect(response.status).toBe(200);
      expect(response.body[0]._id).toEqual(mockRewardNotif._id?.toString());
    });

    it('should return a 500 error when findUser returns null', async () => {
      findUserSpy.mockResolvedValueOnce(null);

      const response = await supertest(app).get(
        `/user/getUserNotifications/${mockNewUserWithNotif.username}`,
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe(
        'Error when finding notifications for user: Could not find user with the given username',
      );
    });
  });

  describe('PUT /markAllNotifsAsRead/:username', () => {
    it('should return an array of updated Notifications when given a valid username', async () => {
      updateUserNotifsAsReadSpy.mockResolvedValueOnce([
        { ...mockRewardNotif, isRead: true },
      ] as Notification[]);
      const response = await supertest(app).put(
        `/user/markAllNotifsAsRead/${mockNewUserWithNotif.username}`,
      );

      expect(response.status).toBe(200);
      expect(response.text).toEqual('All user notifications marked as read');
    });

    it('should return a 500 error if error object returned by `updateUserNotifsAsRead`', async () => {
      updateUserNotifsAsReadSpy.mockRejectedValueOnce({ error: 'Error while finding the user' });
      const response = await supertest(app).put(
        `/user/markAllNotifsAsRead/${mockNewUserWithNotif.username}`,
      );

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Error while marking all notifs of user as read');
    });
  });

  describe('GET /getUserEquippedRewards/:username', () => {
    it(`should return an object with the user's equipped frame and title when given a valid username`, async () => {
      findUserSpy.mockResolvedValueOnce(mockUserWithEquippedRewards);
      const response = await supertest(app).get(
        `/user/getUserEquippedRewards/${mockUserWithEquippedRewards.username}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.equippedFrame).toEqual('profile_frames-02.png');
      expect(response.body.equippedTitle).toEqual('Curious Explorer');
    });

    it('should return a 500 error when findUser returns null', async () => {
      findUserSpy.mockResolvedValueOnce(null);
      const response = await supertest(app).get(`/user/getUserEquippedRewards/invalidusername`);

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Error when fetching equipped frame for user: invalidusername');
    });
  });

  describe('PUT /updateBlockedNotifications', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });

    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });

    it('should return the updated blocked notification types', async () => {
      const mockReqBody = {
        username: 'UserA',
        type: NotificationType.ArticleUpdate,
      };
      updateBlockedTypesSpy.mockResolvedValueOnce({
        ...mockNewUser,
        blockedNotifications: [NotificationType.ArticleUpdate],
      });
      // Making the request
      const response = await supertest(app)
        .put('/user/updateBlockedNotifications')
        .send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual([NotificationType.ArticleUpdate]);
    });

    it('should return bad request if missing username', async () => {
      const mockReqBody = {
        type: NotificationType.ArticleUpdate,
      };
      // Making the request
      const response = await supertest(app)
        .put('/user/updateBlockedNotifications')
        .send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return bad request if missing type to block', async () => {
      const mockReqBody = {
        username: 'UserA',
      };
      // Making the request
      const response = await supertest(app)
        .put('/user/updateBlockedNotifications')
        .send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(400);
    });

    it('should return 500 if error object returned by `updateBlockedTypes`', async () => {
      const mockReqBody = {
        username: 'UserA',
        type: NotificationType.NewPoll,
      };
      updateBlockedTypesSpy.mockResolvedValueOnce({ error: 'Error updating blocked types' });
      // Making the request
      const response = await supertest(app)
        .put('/user/updateBlockedNotifications')
        .send(mockReqBody);

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });
});
