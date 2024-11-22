import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 * - subscribers - The usernames of subscribed users
 * - community - The community the question belongs to
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
  subscribers: string[];
  community?: Community;
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface representing a User document, which contains:
 * - _id - The unique identifier for the user. Optional field
 * - username - The username for the user
 * - password - The password for the user
 * - totalPoints - The total rewards points the user has
 * - unlockedFrames - The filepaths of the frames the user has unlocked
 * - unlockedTitles - The titles the user has unlocked
 * - equippedFrame - The filepath of the frame the user has equipped
 * - equippedTitle - The title the user has equipped
 * - notifications - The notifications the user has
 */
export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
  totalPoints: number;
  unlockedFrames: string[];
  unlockedTitles: string[];
  equippedFrame: string;
  equippedTitle: string;
  notifications: Notification[];
}

/**
 * Interface for the request body when adding a new user.
 * - body - The user being added.
 */
export interface AddUserRequest extends Request {
  body: User;
}

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Interface for the request body when adding points to a user.
 * - body - The username and the number of points to add.
 *  - username - The unique username of the user.
 *  - numPoints - The number of points to add.
 */
export interface AddPointsRequest extends Request {
  body: {
    username: string,
    numPoints: number,
  };
}

/**
 * Interface for the request body when equipping a reward.
 * - body - The username and the number of points to add.
 *  - username - The username of the user who's equipping the reward.
 *  - reward - The reward to equip, either a frame or a title.
 *  - type - The type of reward.
 */
export interface EquipRewardRequest extends Request {
  body: {
    username: string,
    reward: string,
    type: 'frame' | 'title',
  };
}

/**
 * Type representing the possible responses for a reward equip operation.
 */
export type EquipRewardResponse = {
  username: string,
  reward: string,
  type: 'frame' | 'title',
} | { error: string };

/**
 * Interface for the request body when creating a new notification.
 * - body - The ObjectID and the notification to create.
 *  - oid - An ObjectID used to determine what user's to add the new notification to.
 *  - notification - The notification to add.
 */
export interface NewNotificationRequest extends Request {
  body: {
    oid: string,
    notification: Notification,
  };
}

/**
 * NotificationType enum enumerating all possible types of notifications.
 */
export enum NotificationType {
  Answer = 'Answer',
  Comment = 'Comment',
  AnswerComment = 'AnswerComment',
  Upvote = 'Upvote',
  NewQuestion = 'NewQuestion',
  NewPoll = 'NewPoll',
  PollClosed = 'PollClosed',
  NewArticle = 'NewArticle',
  ArticleUpdate = 'ArticleUpdate',
  NewReward = 'NewReward',
}

/**
 * Type representing all types of objects that can be owned by a community.
 */
export type CommunityObjectType = 'Question' | 'Poll' | 'Article';

/**
 * Interface representing a Notification, which contains:
 * - _id - The unique identifier for the notification. Optional field
 * - notificationType - The type of notification.
 * - sourceType - The type of the source of the notification. Optional field
 * - source - The source of the notification. Optional field
 *            source and sourceType are optional as some types of notifications do not have an source
 *            database object. This indicates that the notification is not associated with a particular
 *            question/poll/article and that 'source' comes from something like the user's reward page.
 * - isRead - Whether the notification has been read or not.
 */
export interface Notification {
  _id?: ObjectId;
  notificationType: NotificationType,
  sourceType?: CommunityObjectType,
  source?: Question | Poll | Article,
  isRead: boolean,
}

/**
 * Type representing the possible responses for a Notification-related operation.
 */
export type NotificationResponse = Notification | { error: string };

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface for the request body when subscribing to a question.
 * - body - The question ID and the username of the user subscribing.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user subscribing.
 */
export interface SubscribeRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing the payload for a notification update socket event.
 * - usernames - The users who're being notified.
 */
export interface NotificationUpdatePayload {
  usernames: string[];
}


/**
 * Interface representing the payload for a subscriber update socket event, which contains:
 * - qid - The ID of the question being subscribed to
 * - subscribers - An array of usernamess who subscribed to the question
 */
export interface SubscriberUpdatePayload {
  qid: string;
  subscribers: string[];
}

/**
 * Interface representing the payload for a reward equip update socket event.
 * - username - The user who's equipped reward was updated.
 * - reward - The equipped reward.
 * - type - The type of the reward, either a frame or a title.
 */
export interface RewardUpdatePayload {
  username: string;
  reward: string;
  type: 'frame' | 'title';
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  communityUpdate: (community: CommunityResponse) => void;
  notificationUpdate: (notification: NotificationUpdatePayload) => void;
  singleNotifUpdate: (notification: Notification) => void;
  articleUpdate: (article: ArticleResponse) => void;
  pollUpdate: (poll: PollResponse) => void;
  subscriberUpdate: (update: SubscriberUpdatePayload) => void;
  equippedRewardUpdate: (update: RewardUpdatePayload) => void;
  unlockedRewardUpdate: (update: RewardUpdatePayload) => void;
  upvoteReceived: (username: string) => void;
}

/**
 * Interface representing a PollOption, which contains:
 * - _id - The unique identifier for the poll. Optional field
 * - text - The description of the poll option
 * - usersVoted - An array of usernames who voted for this poll option
 */
export interface PollOption {
  _id?: ObjectId;
  text: string;
  usersVoted: string[];
}

/**
 * Interface representing a Poll, which contains:
 * - _id - The unique identifier for the poll. Optional field
 * - title - The title of the poll.
 * - options - Object IDs of poll options written for this poll that users can vote on.
 * - createdBy - The username of the user that created the poll.
 * - pollDateTime - The date and time when the poll was posted.
 * - pollDueDate - The date and time when the poll stops accepting votes.
 */
export interface Poll {
  _id?: ObjectId;
  title: string;
  options: PollOption[];
  createdBy: string;
  pollDateTime: Date;
  pollDueDate: Date;
}

/**
 * Interface representing an Article, which contains:
 * - _id - The unique identifier for the article. Optional field
 * - title - The title of the article.
 * - body - The content of the article.
 */
export interface Article {
  _id?: ObjectId;
  title: string;
  body: string;
}

/**
 * Interface for the request parameters when finding an article by its ID.
 * - articleID - The unique identifier of the article.
 */
export interface FindArticleById extends Request {
  params: {
    articleID: string;
  };
}

/**
 * Interface for the request for creating an article.
 * - article - The article (duh)
 */
export interface CreateArticleRequest extends Request {
  params: {
    communityId: string,
  }
  body: {
    article: Article,
  }
}

/**
 * Interface for the request object for updating an article.
 * - articleID - The ID of the existing article.
 * - newArticle - The article to replace the existing article.
 */
export interface UpdateArticleRequest extends Request {
  params: {
    articleID: string,
  }
  body: {
    newArticle: Article,
  }
}

/**
 * Type representing the possible responses for an Article-related operation.
 */
export type ArticleResponse = Article | { error: string };

/**
 * Interface representing a Community, which contains:
 * - _id - The unique identifier for the community. Optional field
 * - name - The name of the community.
 * - members - An array of usernames of the members in the community.
 * - questions - An array of questions that have been asked in the community.
 * - polls - An array of polls that have been posted in the community.
 * - articles - An array of articles that have been posted in the community.
 */
export interface Community {
  _id?: ObjectId;
  name: string;
  members: string[];
  questions: Question[] | ObjectId[];
  polls: Poll[] | ObjectId[];
  articles: Article[] | ObjectId[];
}

/**
 * Interface for the request body when adding a new community.
 * - userID - the unique identifier of the user who created the community
 * - community - the Communtiy being added
 */
export interface AddCommunityRequest extends Request {
  body: {
    userID: string;
    community: Community;
  };
}

export interface GetCommunityMembersByObjectIdRequest extends Request {
  params: {
    oid: string;
    objectType: CommunityObjectType;
  }
}

/**
 * Type representing the possible responses for a Community-related operation.
 */
export type CommunityResponse = Community | { error: string };

/**
 * Type representing the possible action options for a challenge's type.
 */
export type ChallengeType = 'answer' | 'question' | 'upvote';

/**
 * Interface representing a Challenge, which contains:
 * - _id - The unique identifier for the challenge. Optional field
 * - description - Text that details the challenge's requirements.
 * - actionAmount: The amount of times that a certain action needs to be performed to complete the challenge.
 * - challengeType: The type of action that needs to be performed to complete the challenge.
 * - hoursToComplete: Amount of hours that a challenge needs to be completed within. Optional field
 * - reward: The reward for completing the challenge.
 */
export interface Challenge {
  _id?: ObjectId;
  description: string;
  actionAmount: number;
  challengeType: ChallengeType;
  hoursToComplete?: number;
  reward: string;
}

/**
 * Interface extending the request body when adding a question to a community, which contains:
 * - communityId - The unique identifier of the community.
 * - questionId - The unique identifier of the question being added to the community.
 */
export interface AddQuestionToCommunityRequest extends Request {
  params: {
    communityId: string;
  };
  body: {
    questionId: string;
  };
}

/**
 * Interface representing a UserChallenge record, which contains:
 * - _id - The unique identifier for the UserChallenge. Optional field
 * - username - The username of the user associated with the UserChallenge
 * - challenge - The Challenge associated with the UserChallenge
 * - progress - The progress the user has made towards the challenge, represented as an array
 *              of timestamps keeping track of when each progress event was made.
 */
export interface UserChallenge {
  _id?: ObjectId;
  username: string;
  challenge: Challenge;
  progress: Date[];
}

/**
 * Interface for the request parameters when incrementing the progress made to a User's challenges.
 * 
 * - userId - The username of the user to increment challenges for
 * - challengeType - The types of challenges to increment progress for
 */
export interface ChallengeProgressRequest extends Request {
  params: {
    username: string;
    challengeType: ChallengeType;
  }
}

/**
 * Interface for the request parameters when fetching a user's challenges.
 * 
 * - username - The username of the user to fetch challenges for.
 */
export interface UserChallengeRequest extends Request {
  params: {
    username: string;
  }
}

/**
 * Type representing the possible responses for a UserChallenge-related operation.
 */
export type UserChallengeResponse = UserChallenge | { error: string };

/**
 * Type representing the possible responses for a Poll-related operation.
 */
export type PollResponse = Poll | { error: string };

/**
 * Interface for the request body when creating a new poll.
 * - communityId - The unique identifier of the community.
 * - poll - The poll being created.
 */
export interface CreatePollRequest extends Request {
  params: {
    communityId: string,
  };
  body: {
    poll: Poll,
  };
}

/**
 * Interface for the request body for getting a poll by its ID.
 * - pollId - The unique identifier of the poll.
 */
export interface GetPollByIdRequest extends Request {
  params: {
    pollId: string;
  };
};

/**
 * Interface for the request body when voting on a poll.
 * - pollId - The ID of the poll.
 * - optionId - The ID of the poll option being voted for.
 * - username - The username of the user voting.
 */
export interface VoteOnPollRequest extends Request {
  body: {
    pollId: string;
    optionId: string;
    username: string;
  };
}

/**
 * Type representing the possible responses for a PollOption-related operation.
 */
export type PollOptionResponse = PollOption | { error: string };
