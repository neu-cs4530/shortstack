import express, { Response } from 'express';
import {
  populateCommunity,
  saveCommunity,
  fetchAllCommunities,
  AddQuestionToCommunityModel,
  addUserToCommunity,
  saveAndAddArticleToCommunity,
  saveAndAddPollToCommunity,
  fetchCommunityByObjectId,
  populateDocument,
} from '../models/application';
import {
  AddCommunityRequest,
  AddQuestionToCommunityRequest,
  CommunityResponse,
  Community,
  FakeSOSocket,
  GetCommunityByObjectIdRequest,
  CreateArticleRequest,
  Article,
  Poll,
  CreatePollRequest,
  QuestionResponse,
} from '../types';

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
   * Function that checks if the article object has all the necessary fields.
   * @param article - The article to validate.
   * @returns true if the article is valid, otherwise false
   */
  const isValidArticle = (article: Article): boolean => !!article.title && !!article.body;

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
   * Adds a question to a specific community's question list.
   *
   * @param req The AddQuestionToCommunity request object containing the community ID and question ID.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addQuestionToCommunity = async (
    req: AddQuestionToCommunityRequest,
    res: Response,
  ): Promise<void> => {
    const { communityId } = req.params;
    const { questionId } = req.body;

    try {
      const updatedQuestion = await AddQuestionToCommunityModel(communityId, questionId);

      if ('error' in updatedQuestion) {
        if (updatedQuestion.error === 'Community not found') {
          res.status(404).send('Community not found');
          return;
        }
        if (updatedQuestion.error === 'Question not found') {
          res.status(404).send('Question not found');
          return;
        }
        throw new Error(updatedQuestion.error);
      }

      // populate tags for the updated question
      const populatedQuestion = await populateDocument(updatedQuestion._id!.toString(), 'question');

      if (!populatedQuestion || 'error' in populatedQuestion) {
        throw new Error(
          populatedQuestion?.error || 'Error populating question with tags and related fields',
        );
      }

      socket.emit('questionUpdate', populatedQuestion as QuestionResponse);
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).send(`Error adding question to community: ${(error as Error).message}`);
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

  /**
   * Gets the community that owns the object.
   * @param req The HTTP request object containing the object ID and object type as parameters.
   * @param res The HTTP response object used to send back the status, or an error message
   *            if the operation failed.
   */
  const getCommunityByObjectId = async (
    req: GetCommunityByObjectIdRequest,
    res: Response,
  ): Promise<void> => {
    const { oid, objectType } = req.params;

    try {
      const community = await fetchCommunityByObjectId(oid, objectType);

      res.json(community);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  /**
   * Adds an article to the community and saves the article.
   * @param req The HTTP request object containing the object ID and object type as parameters.
   * @param res The HTTP response object used to send back the status, or an error message
   *            if the operation failed.
   */
  const addArticleToCommunity = async (req: CreateArticleRequest, res: Response): Promise<void> => {
    const { communityId } = req.params;
    const { article } = req.body;

    if (!isValidArticle(article)) {
      res.status(400).send('Invalid request body');
      return;
    }

    try {
      article.createdDate = new Date();
      article.latestEditDate = new Date();

      const savedArticle = await saveAndAddArticleToCommunity(communityId, article);

      if (savedArticle && 'error' in savedArticle) {
        throw new Error(savedArticle.error);
      }

      socket.emit('articleUpdate', savedArticle);
      res.json(savedArticle);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  /**
   * Function that checks if the poll object has all the necessary fields.
   * @param poll - The poll to validate.
   * @returns true if the poll is valid, otherwise false
   */
  const isValidPoll = (poll: Poll): boolean =>
    !!poll.title && !!poll.options && poll.options.length > 0;

  /**
   * Adds a poll to the community and saves the poll.
   * @param req The HTTP request object containing the community ID and poll data.
   * @param res The HTTP response object used to send back the status, or an error message if the operation failed.
   */
  const addPollToCommunity = async (req: CreatePollRequest, res: Response): Promise<void> => {
    const { communityId } = req.params;
    const { poll } = req.body;

    if (!isValidPoll(poll)) {
      res.status(400).send('Invalid request body');
      return;
    }

    try {
      const savedPoll = await saveAndAddPollToCommunity(communityId, poll);

      if (savedPoll && 'error' in savedPoll) {
        throw new Error(savedPoll.error);
      }

      socket.emit('pollUpdate', savedPoll);
      res.json(savedPoll);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.post('/addCommunity', addCommunity);
  router.get('/getCommunity', getAllCommunities);
  router.get('/getCommunityById/:communityId', getCommunityById);
  router.put('/joinCommunity/:communityId/:userId', joinCommunity);
  router.put('/addQuestionToCommunity/:communityId', addQuestionToCommunity);
  router.get('/getCommunityByObjectId/:oid/:objectType', getCommunityByObjectId);
  router.post('/addArticle/:communityId', addArticleToCommunity);
  router.post('/addPoll/:communityId', addPollToCommunity);

  return router;
};

export default communityController;
