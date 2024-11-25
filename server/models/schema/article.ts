import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Article collection.
 *
 * This schema defines the structure of articles in the database.
 * Each article includes the following fields:
 * - `title`: The title of the article.
 * - `body`: The content of the article.
 * - `createdDate`: The date the article was created.
 * - `latestEditDate`: The date the article was most recently edited.
 */
const articleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
    },
    latestEditDate: {
      type: Date,
      required: true,
    },
  },
  { collection: 'Article' },
);

export default articleSchema;
