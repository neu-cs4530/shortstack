import { Schema } from 'mongoose';
/**
 * Mongoose schema for the UserChallnge collection.
 *
 * This schema defines the structure for storing UserChallenges in the database.
 * Each UserChallenge includes the following fields:
 * - `username`: The username of the user associated with the user challenge record.
 * - `challenge`: The challenge associated with the user challenge record.
 * - `progress`: The progress the user has made towards the challenge, represented as an array
 *               of timestamps keeping track of when each progress event was made.
 */
const userChallengeSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    progress: {
      type: [Date],
      default: [],
    },
  },
  { collection: 'UserChallenge' },
);

export default userChallengeSchema;
