import mongoose, { Model } from 'mongoose';
import articleSchema from './schema/article';
import { Article } from '../types';

/**
 * Mongoose model for the `Article` collection.
 *
 * This model is created using the `Article` interface and the `articleSchema`, representing the
 * `Article` collection in the MongoDB database, and provides an interface for interacting with
 * the stored articles.
 *
 * @type {Model<Article>}
 */
const ArticleModel: Model<Article> = mongoose.model<Article>('Article', articleSchema);

export default ArticleModel;
