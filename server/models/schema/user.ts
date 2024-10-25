import { Schema } from 'mongoose';
/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each User includes the following fields:
 * - `username`: The user's username.
 * - `password`: The user's password.
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
    },
    password: {
      type: String,
    },
    totalPoints: {
      type: String,
    },
    unlockedFrames: [{ type: String }],
    unlockedTitles: [{ type: String }],
    equippedFrame: {
      type: String,
    },
    equippedTitle: {
      type: String,
    },
  },
  { collection: 'User' },
);

export default userSchema;
