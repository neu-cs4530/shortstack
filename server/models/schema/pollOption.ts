import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Poll collection.
 *
 * This schema defines the structure for storing voting options for polls in the database.
 * Each poll includes the following fields:
 * - `text`: The description of the poll option
 * - `usersVoted`: An array of usernames that voted for this poll option.
 */
const pollOptionSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    usersVoted: {
      type: [{ type: String }],
      default: [],
    },
  },
  { collection: 'PollOption' },
);

export default pollOptionSchema;
