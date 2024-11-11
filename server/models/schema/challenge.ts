import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Challenge collection.
 *
 * This schema defines the structure for storing challenges in the database.
 * Each challenge includes the following fields:
 * - `description`: Text that details the challenge's requirements.
 * - `actionAmount`: The amount of times that a certain action needs to be performed to complete the challenge.
 * - `challengeType`: The type of action that needs to be performed to complete the challenge.
 * - `hoursToComplete`: Amount of hours that a challenge needs to be completed within.
 * - `reward`: The reward that the user receives upon completing the challenge.
 */
const challengeSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    actionAmount: {
      type: Number,
      required: true,
    },
    challengeType: {
      type: String,
      required: true,
    },
    hoursToComplete: {
      type: Number,
    },
    reward: {
      type: String,
      required: true,
    },
  },
  { collection: 'Challenge' },
);

export default challengeSchema;
