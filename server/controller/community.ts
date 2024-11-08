import express, { Response } from 'express';
import { populateCommunity, saveCommunity, fetchAllCommunities } from '../models/application';
import { AddCommunityRequest, Community } from '../types';

const communityController = () => {
  const router = express.Router();

  /**
   * Function that checks if the community object has all the necessary fields.
   *
   * @param community - the community object to validate.
   * @returns 'true' if the community is valid, otherwise 'false'.
   */
  const isCommunityBodyValid = (community: Community): boolean =>
    community.name !== undefined &&
    community.name !== '' &&
    community.members !== undefined &&
    community.members.length >= 0 &&
    community.questions !== undefined &&
    community.polls !== undefined &&
    community.articles !== undefined;

  /**
   * Adds a new community to the database. The community is first validated and then saved.
   * If saving the community fails, the HTTP response status is updated.
   *
   * @param req The AddCommunityRequest object containing the community data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addCommunity = async (req: AddCommunityRequest, res: Response): Promise<void> => {
    if (!isCommunityBodyValid(req.body)) {
      res.status(400).send('Invalid community body');
      return;
    }
    const community: Community = req.body;
    try {
      const result = await saveCommunity(community);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the community that was added, and emits the new object
      const populatedCommunity = await populateCommunity(result._id?.toString());

      if (populatedCommunity && 'error' in populatedCommunity) {
        throw new Error(populatedCommunity.error);
      }

      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving community: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving community`);
      }
    }
  };

  /**
   * Gets all the communities from the database.
   *
   * @param req The HTTP request object.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getAllCommunities = async (req: express.Request, res: Response): Promise<void> => {
    try {
      const communities = await fetchAllCommunities();
      if ('error' in communities) {
        throw new Error(communities.error);
      }
      res.status(200).send(communities);
    } catch (error) {
      res.status(500).send('Error fetching communities');
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.post('/add', addCommunity);
  router.get('/communities', getAllCommunities);

  return router;
};

export default communityController;
