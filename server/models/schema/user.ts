import { Schema } from 'mongoose';
/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each User includes the following fields:
 * - `username`: The user's username. This field is required.
 * - `password`: The user's password. This field is required.
 * - `totalPoints`: The total reward points the user has.
 * - `unlockedFrames`: An array of strings representing the file paths of the frames the user has unlocked.
 * - `unlockedTitles`: An array of the string titles the user has unlocked.
 * - `equippedFrame`: The filepath of the frame the user has equipped.
 * - `equippedTitle`: The string of the title the user has equipped.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    unlockedFrames: { type: [String], default: [] },
    unlockedTitles: { type: [String], default: [] },
    equippedFrame: {
      type: String,
      default: '',
    },
    equippedTitle: {
      type: String,
      default: '',
    },
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  },
  { collection: 'User' },
);

export default userSchema;
