import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Poll collection.
 *
 * This schema defines the structure for storing polls in the database.
 * Each poll includes the following fields:
 * - `title`: The title of the poll.
 * - `options`: An array of references to `PollOption` documents associated with the poll.
 * - `createdBy`: The username of the user that created the poll.
 * - `pollDateTime`: The date and time when the poll was posted.
 * - `pollDueDate` : The date and time when the poll stops accepting votes.
 * - `isClosed` : Whether or not the poll has been closed.
 */
const pollSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    options: {
      type: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }],
      default: [],
    },
    createdBy: {
      type: String,
    },
    pollDateTime: {
      type: Date,
    },
    pollDueDate: {
      type: Date,
    },
    isClosed: {
      type: Boolean,
    },
  },
  { collection: 'Poll' },
);

export default pollSchema;
