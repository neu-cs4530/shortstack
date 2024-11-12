import { ChangeEvent, FormEvent } from 'react';
import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Represents a user in the application.
 */
export interface User {
  _id?: string;
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
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  _id?: string;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update socket event.
 * - username - The users who're being notified.
 */
export interface NotificationUpdatePayload {
  usernames: string[];
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  communityUpdate: (update: Community) => void;
  notificationUpdate: (notification: NotificationUpdatePayload) => void;
}

/**
 * Interface representing an Article, which contains:
 * - _id - The unique identifier for the article. Optional field
 * - title - The title of the article.
 * - body - The content of the article.
 */
export interface Article {
  _id?: string;
  title: string;
  body: string;
}

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
  _id?: string;
  name: string;
  members: string[];
  questions: Question[];
  polls: Poll[];
  articles: Article[];
}

/**
 * Interface representing a PollOption, which contains:
 * - _id - The unique identifier for the poll. Optional field
 * - text - The description of the poll option
 * - usersVoted - An array of usernames who voted for this poll option
 */
export interface PollOption {
  _id?: string;
  text: string;
  usersVoted: string[];
}

/**
 * Interface representing a Poll, which contains:
 * - _id - The unique identifier for the poll. Optional field
 * - title - The title of the poll.
 * - options - An array of poll options written for this poll for users can vote on.
 * - createdBy - The username of the user that created the poll.
 * - pollDateTime - The date and time when the poll was posted.
 * - pollDueDate - The date and time when the poll stops accepting votes.
 */
export interface Poll {
  _id?: string;
  title: string;
  options: PollOption[];
  createdBy: string;
  pollDateTime: Date;
  pollDueDate: Date;
}

/**
 * Interface representing the props for the Poll components.
 *
 * selectedOption - the poll option currently selected by the user while voting.
 * voteButtonClick - the function that handles a user hitting the vote button for a poll.
 * onOptionChange - the function to update the selected poll option when the user clicks a different option.
 * poll - The Poll object containing details about the Poll.
 */
export interface PollProps {
  selectedOption?: PollOption | undefined;
  voteButtonClick?: (event: FormEvent<HTMLFormElement>) => void;
  onOptionChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  poll: Poll;
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
  _id?: string;
  notificationType: NotificationType;
  sourceType?: 'Question' | 'Poll' | 'Article';
  source?: Question | Poll | Article;
  isRead: boolean;
}

/**
 * Type representing the possible responses for a Notification-related operation.
 */
export type NotificationResponse = Notification | { error: string };
