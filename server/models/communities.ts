import mongoose, { Model } from 'mongoose';
import communitySchema from './schema/community';
import { Community } from '../types';

/**
 * Mongoose model for the `Community` collection.
 *
 * This model is created using the `Community` interface and the `communitySchema`, representing the
 * `Community` collection in the MongoDB database, and provides an interface for interacting with
 * the stored communities.
 *
 * @type {Model<Community>}
 */
const CommunityModel: Model<Community> = mongoose.model<Community>('Community', communitySchema);

export default CommunityModel;
