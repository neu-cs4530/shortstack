import { Schema } from 'mongoose';
import { NotificationType } from '../../types';

/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure for storing notifications in the database.
 * Each notification includes the following fields:
 * - `notificationType`: The type of notification. This field is required.
 * - `sourceType`: The type of the source. This field is not required.
 * - `source`: The source of the notification. Populated by refPath given by `sourceType`.
 *             This field is not required as some notification types do not have a source database object.
 * - `isRead`: Whether the notification has been read or not. This field is required.
 */
const notificationSchema: Schema = new Schema(
  {
    notificationType: {
      type: String,
      enum: NotificationType,
      required: true,
    },
    sourceType: {
      type: String,
      enum: ['Question', 'Poll', 'Article'],
      required: false,
    },
    source: {
      type: Schema.Types.ObjectId,
      refPath: 'sourceType',
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { collection: 'Notification' },
);

export default notificationSchema;
