import express, { Response } from 'express';
import {
  populateCommunity,
  saveCommunity,
  fetchAllCommunities,
  addUserToCommunity,
} from '../models/application';
import { AddCommunityRequest, Community, CommunityResponse, FakeSOSocket } from '../types';

const communityController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Function that checks if the add community request contains the required fields.
   * @param req - The request object containing community data.
   * @returns - true if the request if valid, false otherwise.
   */
  function isRequestValid(req: AddCommunityRequest): boolean {
    return !!req.body.community;
  }

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
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isCommunityBodyValid(req.body.community)) {
      res.status(400).send('Invalid community');
      return;
    }
    const { community } = req.body;
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
      socket.emit('communityUpdate', populatedCommunity as Community);
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

  /**
   * Fetches a specific community by its ID.
   *
   * @param req The HTTP request object containing the community ID as a parameter.
   * @param res The HTTP response object used to send back the community details.
   *
   * @returns A Promise that resolves to void.
   */
  const getCommunityById = async (req: express.Request, res: Response): Promise<void> => {
    const { communityId } = req.params;
    try {
      const community = await populateCommunity(communityId);
      if (!community || 'error' in community) {
        throw new Error(community ? community.error : 'Community not found');
      }
      res.status(200).json(community);
    } catch (error) {
      res.status(500).send('Error fetching community details');
    }
  };

  /**
   * Adds a user to the community.
   * @param req The HTTP request object containing the community ID and userID as parameters.
   * @param res The HTTP response object used to send back the status, or an error message
   *            if the operation failed.
   */
  const joinCommunity = async (req: express.Request, res: Response): Promise<void> => {
    const { communityId, userId } = req.params;

    try {
      const communityResponse = await addUserToCommunity(userId, communityId);

      if (!communityResponse) {
        res.status(404).send('Community or User not found');
        return;
      }
      if ('error' in communityResponse) {
        throw new Error(communityResponse.error);
      }

      // populates the joined community
      const populatedCommunity = await populateCommunity(communityResponse._id?.toString());

      if (populatedCommunity && 'error' in populatedCommunity) {
        throw new Error(populatedCommunity.error as string);
      }

      // emits the community with the newly added member
      socket.emit('communityUpdate', populatedCommunity as CommunityResponse);
      res.status(200).send();
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  // TODO: change URIs to follow style guide (/addCommunity, /getCommunity, /getCommunityById)
  router.post('/add', addCommunity);
  router.get('/communities', getAllCommunities);
  router.get('/communities/:communityId', getCommunityById);
  router.put('/joinCommunity/:communityId/:userId', joinCommunity);

  return router;
};

export default communityController;
