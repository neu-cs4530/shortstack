import mongoose from 'mongoose';
import supertest from 'supertest';
import * as util from '../models/application';
import { Notification, NotificationType } from '../types';
import { app } from '../app';

const updateNotifAsReadSpy = jest.spyOn(util, 'updateNotifAsRead');

describe('Notification API', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  describe('PUT /markAsRead/:notifId', () => {
    it('should return the notification if it is marked as read', async () => {
      const mockNotifId = new mongoose.Types.ObjectId();
      const mockNotif: Notification = {
        _id: mockNotifId,
        notificationType: NotificationType.NewReward,
        isRead: true,
      };

      updateNotifAsReadSpy.mockResolvedValueOnce(mockNotif);

      const response = await supertest(app).put(`/notification/markAsRead/${mockNotifId}`);

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(mockNotifId.toString());
    });
    it('should return a 500 status if the operation fails', async () => {
      const mockNotif: Notification = {
        _id: new mongoose.Types.ObjectId(),
        notificationType: NotificationType.NewReward,
        isRead: true,
      };

      updateNotifAsReadSpy.mockResolvedValueOnce({ error: 'error' });

      const response = await supertest(app).put(`/notification/markAsRead/${mockNotif._id}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('error');
    });
  });
});
