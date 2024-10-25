import mongoose, { Model } from 'mongoose';
import pollOptionSchema from './schema/pollOption';
import { PollOption } from '../types';

/**
 * Mongoose model for the `PollOption` collection.
 *
 * This model is created using the `PollOption` interface and the `pollOptionSchema`, representing the
 * `PollOption` collection in the MongoDB database, and provides an interface for interacting with
 * the stored polls.
 *
 * @type {Model<PollOption>}
 */
const PollOptionModel: Model<PollOption> = mongoose.model<PollOption>(
  'PollOption',
  pollOptionSchema,
);

export default PollOptionModel;
