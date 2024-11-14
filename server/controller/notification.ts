import express, { Response } from 'express';
import { updateNotifAsRead } from '../models/application';
import { FakeSOSocket } from '../types';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Marks the notification as read.
   *
   * @param req The request object containing the notifId param.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const markNotifAsRead = async (req: express.Request, res: Response): Promise<void> => {
    const { notifId } = req.params;

    try {
      const updatedNotification = await updateNotifAsRead(notifId);

      if ('error' in updatedNotification) {
        throw new Error(updatedNotification.error);
      }

      socket.emit('singleNotifUpdate', updatedNotification);
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  router.put('/markAsRead/:notifId', markNotifAsRead);

  return router;
};

export default notificationController;
