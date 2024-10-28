import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Article collection.
 *
 * This schema defines the structure of articles in the database.
 * Each article includes the following fields:
 * - `title`: The title of the article.
 * - `body`: The content of the article.
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
  },
  { collection: 'Article' },
);

export default articleSchema;
