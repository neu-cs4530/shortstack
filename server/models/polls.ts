import mongoose, { Model } from 'mongoose';
import pollSchema from './schema/poll';
import { Poll } from '../types';

/**
 * Mongoose model for the `Poll` collection.
 *
 * This model is created using the `Poll` interface and the `pollSchema`, representing the
 * `Poll` collection in the MongoDB database, and provides an interface for interacting with
 * the stored polls.
 *
 * @type {Model<Poll>}
 */
const PollModel: Model<Poll> = mongoose.model<Poll>('Poll', pollSchema);

export default PollModel;
