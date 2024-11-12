import { ObjectId } from 'mongodb';
import { QueryOptions } from 'mongoose';
import {
  Answer,
  AnswerResponse,
  ArticleResponse,
  Comment,
  CommentResponse,
  Community,
  CommunityResponse,
  Notification,
  NotificationResponse,
  NotificationType,
  OrderType,
  Question,
  QuestionResponse,
  Tag,
  User,
  UserResponse,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import UserModel from './users';
import CommunityModel from './communities';
import PollModel from './polls';
import ArticleModel from './articles';
import NotificationModel from './notifications';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The username of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], askedBy: string): Question[] =>
  qlist.filter(q => q.askedBy === askedBy);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches and populates a question or answer document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question or answer to fetch.
 * @param {'question' | 'answer'} type - Specifies whether to fetch a question or an answer.
 *
 * @returns {Promise<QuestionResponse | AnswerResponse>} - Promise that resolves to the
 *          populated question or answer, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer',
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!id) {
      throw new Error(`Provided ${type} ID is undefined.`);
    }

    let result = null;

    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: { path: 'comments', model: CommentModel },
        },
        { path: 'comments', model: CommentModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        { path: 'comments', model: CommentModel },
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches and populates a community document based on the provided ID.
 *
 * @param {string | undefined} id - The ID of the community to fetch.
 *
 * @returns {Promise<CommunityResponse>} - Promise that resolves to the
 *          populated community, or an error message if the operation fails
 */
export const populateCommunity = async (id: string | undefined): Promise<CommunityResponse> => {
  try {
    if (!id) {
      throw new Error(`Provided community ID is undefined.`);
    }

    let result = null;
    result = await CommunityModel.findOne({ _id: id }).populate([
      { path: 'questions', model: QuestionModel },
      { path: 'polls', model: PollModel },
      { path: 'articles', model: ArticleModel },
    ]);

    if (!result) {
      throw new Error(`Failed to fetch and populate the community`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a community: ${(error as Error).message}` };
  }
};

/**
 * Fetches and populates a notification document based on the provided ID and source type.
 *
 * @param {string | undefined} id - The ID of the notification to fetch.
 * @param {'Question' | 'Poll' | 'Article' | undefined} sourceType - Specifies how to
 *        populate the notification's source, if defined.
 *
 * @returns {Promise<NotificationResponse>} - Promise that resolves to the
 *          populated notification, or an error message if the operation fails
 */
export const populateNotification = async (
  id: string | undefined,
  sourceType: 'Question' | 'Poll' | 'Article' | undefined,
): Promise<NotificationResponse> => {
  try {
    if (!id) {
      throw new Error(`Provided id is undefined.`);
    }
    let result = null;
    if (!sourceType) {
      // no source object for reward notifications, no need to populate.
      result = await NotificationModel.findOne({ _id: id });
    } else if (sourceType === 'Question') {
      result = await NotificationModel.findOne({ _id: id }).populate([
        {
          path: 'source',
          model: QuestionModel,
        },
      ]);
    } else if (sourceType === 'Poll') {
      result = await NotificationModel.findOne({ _id: id }).populate([
        {
          path: 'source',
          model: PollModel,
        },
      ]);
    } else if (sourceType === 'Article') {
      result = await NotificationModel.findOne({ _id: id }).populate([
        {
          path: 'source',
          model: ArticleModel,
        },
      ]);
    }

    if (!result) {
      throw new Error(`Failed to fetch and populate the notification`);
    }
    return result;
  } catch (error) {
    return {
      error: `Error when fetching and populating a notification: ${(error as Error).message}`,
    };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} username - The username of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  username: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: username } },
      { new: true },
    ).populate([
      {
        path: 'tags',
        model: TagModel,
      },
      {
        path: 'answers',
        model: AnswerModel,
        populate: { path: 'comments', model: CommentModel },
      },
      { path: 'comments', model: CommentModel },
    ]);
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(answer);
    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);
    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Saves a new community to the database.
 *
 * @param {Community} community - The community to save
 * @returns {Promise<CommunityResponse>} - The saved community, or an error message if the save failed
 */
export const saveCommunity = async (community: Community): Promise<CommunityResponse> => {
  try {
    const result = await CommunityModel.create(community);
    return result;
  } catch (error) {
    return { error: 'Error when saving a community' };
  }
};

/**
 * Adds a user to a community.
 *
 * @param {string} userId - The user ID of the user to add.
 * @param {string} communityId - The ID of the community to add the user to.
 * @returns {Promise<CommunityResponse | null>} - The community added to, null if the community or user does not exist,
 *  or an error message if the save failed
 */
export const addUserToCommunity = async (
  userId: string,
  communityId: string,
): Promise<CommunityResponse | null> => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }

    const result = await CommunityModel.findOneAndUpdate(
      { _id: new ObjectId(communityId) },
      { $addToSet: { members: user.username } },
      { new: true },
    );

    return result;
  } catch (error) {
    return { error: `Error when adding user to community: ${(error as Error).message}` };
  }
};

// type checking utility for type-safe access to error code
const isMongoError = (error: unknown): error is { code?: number } =>
  typeof error === 'object' && error !== null && 'code' in error;

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user to save
 *
 * @returns {Promise<UserResponse>} - The saved user, or an error message if the save failed
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const result = await UserModel.create(user);
    return result;
  } catch (error) {
    if (isMongoError(error)) {
      if (error.code === 11000) {
        // return specific message if error code matched MongoDB duplicate key error
        return { error: 'Username must be unique' };
      }
    }
    return { error: 'Error when saving a user' };
  }
};

/**
 * Finds a user by their username.
 * @param username The username of the user to find.
 * @returns The user if found, otherwise null.
 */
export const findUser = async (username: string): Promise<User | null> => {
  try {
    return await UserModel.findOne({ username });
  } catch (error) {
    return null;
  }
};

/**
 * Adds points to a user in the database.
 *
 * @param {string} username - The username of the user to add points to
 * @param {number} numPoints - The number of points to add
 *
 * @returns {Promise<UserResponse>} - The updated user, or an error message if the update failed
 */
export const addPointsToUser = async (
  username: string,
  numPoints: number,
): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { username },
      { $inc: { totalPoints: numPoints } },
      { new: true },
    );
    if (!result) {
      return { error: 'User not found' };
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding points to a user' };
  }
};

// Given answered Question ID, notify question.askedBy and question subscribers
const usersToNotifyOnNewAnswer = async (qid: string): Promise<string[]> => {
  const question = await QuestionModel.findOne({ _id: qid });
  if (!question) {
    throw new Error('Error retrieving users to notify');
  }
  // TODO: return question.subscribers usernames once subscription has been implemented.
  return [question.askedBy];
};

// Given Question ID, notify question.askedBy on new Comment or Upvote
const questionAskerToNotify = async (qid: string): Promise<string[]> => {
  const question = await QuestionModel.findOne({ _id: qid });
  if (!question) {
    throw new Error('Error retrieving users to notify');
  }
  return [question.askedBy];
};

// Given ID of commented-on Answer, notify answer.ansBy
const userToNotifyOnAnswerComment = async (answerID: string): Promise<string[]> => {
  const ans = await AnswerModel.findOne({ _id: answerID });
  if (!ans) {
    throw new Error('Error retrieving users to notify');
  }
  return [ans.ansBy];
};

// Given Question, Poll, or Article ID, notify members of the community the new post was made in.
const usersToNotifyOnNewCommunityPost = async (
  oid: string,
  type: 'Question' | 'Poll' | 'Article',
): Promise<string[]> => {
  let community;
  if (type === 'Question') {
    community = await CommunityModel.findOne({ questions: oid });
  } else if (type === 'Poll') {
    community = await CommunityModel.findOne({ polls: oid });
  } else if (type === 'Article') {
    community = await CommunityModel.findOne({ articles: oid });
  }
  if (!community) {
    throw new Error('Error retrieving users to notify');
  }
  const communityUsernames = community.members;
  return communityUsernames;
};

// Given ID of closed Poll, notify poll.createdBy and all users who voted in the poll.
const usersToNotifyPollClosed = async (pid: string): Promise<string[]> => {
  const poll = await PollModel.findOne({ _id: pid }).populate([
    {
      path: 'createdBy',
      model: UserModel,
    },
    {
      path: 'options',
      model: PollModel,
    },
  ]);
  if (!poll) {
    throw new Error('Error retrieving users to notify');
  }
  const usersVoted = poll.options.map(op => op.usersVoted).flat();
  return [poll.createdBy.username, ...usersVoted];
};

// Given ID of User who unlocked new reward, notify user.username.
const userToNotifyForReward = async (uid: string): Promise<string[]> => {
  const user = await UserModel.findOne({ _id: uid });
  if (!user) {
    throw new Error('Error retrieving user to notify');
  }
  return [user.username];
};

/**
 * Determines a list of usernames to notify based on the given ObjectID and NotificationType.
 *
 * - Answer : Given Question ID, notify question.askedBy and question subscribers.
 * - Comment : Given Question ID, notify question.askedBy.
 * - AnswerComment : Given Answer ID, notify answer.ansBy
 * - Upvote : Given Question ID, notify question.askedBy.
 * - NewQuestion : Given Question ID, notify members of the community the question was posted in.
 * - NewPoll : Given Poll ID, notify members of the community the poll was posted in.
 * - PollClosed : Given Poll ID, notify poll.createdBy and users who voted in the poll.
 * - NewArticle : Given Article ID, notify members of the community the article was posted in.
 * - ArticleUpdate : Given Article ID, notify members of the community the article was posted in.
 * - NewReward : Given User ID, notify the user.
 *
 * @param {string} oid - The ObjectID used to retrieve the usernames to notify from the database.
 * @param {NotificationType} type - The notification type.
 *
 * @returns {Promise<string[] | { error: string }>} - The list of usernames, or an error message if the lookup failed
 */
export const usersToNotify = async (
  oid: string,
  type: NotificationType,
): Promise<string[] | { error: string }> => {
  try {
    switch (type) {
      case NotificationType.Answer:
        return await usersToNotifyOnNewAnswer(oid);

      case NotificationType.Comment:
        return await questionAskerToNotify(oid);

      case NotificationType.AnswerComment:
        return await userToNotifyOnAnswerComment(oid);

      case NotificationType.Upvote:
        return await questionAskerToNotify(oid);

      case NotificationType.NewQuestion:
        return await usersToNotifyOnNewCommunityPost(oid, 'Question');

      case NotificationType.NewPoll:
        return await usersToNotifyOnNewCommunityPost(oid, 'Poll');

      case NotificationType.PollClosed:
        return await usersToNotifyPollClosed(oid);

      case NotificationType.NewArticle:
        return await usersToNotifyOnNewCommunityPost(oid, 'Article');

      case NotificationType.ArticleUpdate:
        return await usersToNotifyOnNewCommunityPost(oid, 'Article');

      case NotificationType.NewReward:
        return await userToNotifyForReward(oid);

      default:
        return [];
    }
  } catch (error) {
    return { error: 'Error retrieving users to notify' };
  }
};

/**
 * Saves a notification to the database.
 *
 * @param {Notification} notification - The notification to save.
 *
 * @returns {Promise<NotificationResponse>} - The saved notification, or an error message if the save failed
 */
export const saveNotification = async (
  notification: Notification,
): Promise<NotificationResponse> => {
  try {
    const result = await NotificationModel.create(notification);
    return result;
  } catch (error) {
    return { error: 'Error when saving a notification' };
  }
};

/**
 * Adds a notification to a user.
 *
 * @param {string} username - The username of the user to add the notification to
 * @param {Notification} notif - The notification to add
 *
 * @returns {Promise<UserResponse>} - The updated question or an error message
 */
export const addNotificationToUser = async (
  username: string,
  notif: Notification,
): Promise<UserResponse> => {
  try {
    if (!notif || !notif.notificationType || notif.isRead === undefined || notif.isRead === null) {
      throw new Error('Invalid notification');
    }
    const result = await UserModel.findOneAndUpdate(
      { username },
      { $push: { notifications: { $each: [notif._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding notification to user');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding notification to user' };
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a question.
 *
 * @param qid The ID of the question to add a vote to.
 * @param username The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToQuestion = async (
  qid: string,
  username: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
              { $concatArrays: ['$upVotes', [username]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [username, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', username] } } },
              { $concatArrays: ['$downVotes', [username]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [username, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', username] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await QuestionModel.findOneAndUpdate({ _id: qid }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Question not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(username)
        ? 'Question upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(username)
        ? 'Question downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to question'
          : 'Error when adding downvote to question',
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

/**
 * Fetches an article by its ID.
 *a
 * @param {string} articleID - The ID of the article to fetch.
 *
 * @returns {Promise<ArticleResponse>} - Promise that resolves to the fetched article, or an error message.
 */
export const fetchArticleById = async (articleID: string): Promise<ArticleResponse> => {
  try {
    const article = await ArticleModel.findOne({ _id: articleID });
    if (!article) {
      throw new Error('Unable to find article');
    }
    return article;
  } catch (error) {
    return { error: 'Error when fetching an article by ID' };
  }
};

/**
 * Gets all the communities from the database, fully populated with members, questions, polls, and articles.
 *
 * @returns {Promise<Community[] | { error: string }>} - The list of populated communities, or an error message if the operation fails
 */
export const fetchAllCommunities = async (): Promise<Community[] | { error: string }> => {
  try {
    const communities = await CommunityModel.find();
    const populatedCommunities = await Promise.all(
      communities.map(community => populateCommunity(community._id.toString())),
    );

    // Filter for errors and return only valid communities
    const validCommunities = populatedCommunities.filter(
      (community): community is Community => !('error' in community),
    );

    return validCommunities;
  } catch (error) {
    return { error: 'Error when fetching communities' };
  }
};

/**
 * Adds a question ID to the specified community's question list.
 *
 * @param communityId - The ID of the community.
 * @param questionId - The ID of the question to add.
 * @returns The updated community document or an error object.
 */
export const AddQuestionToCommunityModel = async (communityId: string, questionId: string) => {
  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      communityId,
      { $push: { questions: questionId } },
      { new: true },
    );

    if (!updatedCommunity) {
      return { error: 'Community not found' };
    }

    const populatedCommunity = await populateCommunity(communityId);

    if (populatedCommunity && 'error' in populatedCommunity) {
      throw new Error(populatedCommunity.error);
    }

    return populatedCommunity;
  } catch (error) {
    return { error: 'Error adding question to community' };
  }
};
