import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Community collection.
 *
 * This schema defines the structure of communities in the database.
 * Each community includes the following fields:
 * - `name`: The name of the community.
 * - `members`: An array of user IDs representing the members of the community.
 * - `questions`: An array of question IDs representing the questions posted in the community.
 * - `polls`: An array of poll IDs representing the polls posted in the community.
 * - `articles`: An array of article IDs representing the articles posted in the community.
 */
const communitySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    polls: [{ type: Schema.Types.ObjectId, ref: 'Poll' }],
    articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  },
  { collection: 'Community' },
);

export default communitySchema;
