import mongoose, { Model } from 'mongoose';
import challengeSchema from './schema/challenge';
import { Challenge } from '../types';

/**
 * Mongoose model for the `Challenge` collection.
 *
 * This model is created using the `Challenge` interface and the `challengeSchema`, representing the
 * `Challenge` collection in the MongoDB database, and provides an interface for interacting with
 * the stored challenges.
 *
 * @type {Model<Challenge>}
 */
const ChallengeModel: Model<Challenge> = mongoose.model<Challenge>('Challenge', challengeSchema);

export default ChallengeModel;
