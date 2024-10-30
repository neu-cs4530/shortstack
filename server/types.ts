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
}

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
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
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
 * - createdBy - The user that created the poll.
 * - pollDateTime - The date and time when the poll was posted.
 * - pollDueDate - The date and time when the poll stops accepting votes.
 */
export interface Poll {
  _id?: ObjectId;
  title: string;
  options: PollOption[];
  createdBy: User;
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
 * Interface representing a Community, which contains:
 * - _id - The unique identifier for the community. Optional field
 * - name - The name of the community.
 * - members - An array of users who are members of the community.
 * - questions - An array of questions that have been asked in the community.
 * - polls - An array of polls that have been posted in the community.
 * - articles - An array of articles that have been posted in the community.
 */
export interface Community {
  _id?: ObjectId;
  name: string;
  members: User[];
  questions: Question[];
  polls: Poll[];
  articles: Article[];
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
 * Interface representing a Notification, which contains:
 * - notificationType - The type of notification.
 * - sourceType - The type of the source of the notification.
 * - source - The source of the notification.
 * - isRead - Whether the notification has been read or not.
 */
export interface Notification {
  notificationType: NotificationType,
  sourceType: 'Question' | 'Poll' | 'Article',
  source: Question | Poll | Article,
  isRead: boolean,
}