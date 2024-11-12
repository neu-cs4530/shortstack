import mongoose, { Model } from 'mongoose';
import { UserChallenge } from '../types';
import userChallengeSchema from './schema/userChallenge';

/**
 * Mongoose model for the `UserChallenge` collection.
 *
 * This model is created using the `UserChallenge` interface and the `userChallengeSchema`, representing the
 * `UserChallenge` collection in the MongoDB database, and provides an interface for interacting with
 * the stored UserChallenges.
 *
 * @type {Model<UserChallenge>}
 */
const UserChallengeModel: Model<UserChallenge> = mongoose.model<UserChallenge>(
  'UserChallenge',
  userChallengeSchema,
);

export default UserChallengeModel;
