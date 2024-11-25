/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import Tags from '../models/tags';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  saveUser,
  findUser,
  addPointsToUser,
  saveCommunity,
  populateCommunity,
  populateNotification,
  saveNotification,
  addNotificationToUser,
  addUserToCommunity,
  usersToNotify,
  fetchArticleById,
  saveUserChallenge,
  fetchUserChallengesByUsername,
  fetchAndIncrementChallengesByUserAndType,
  updateNotifAsRead,
  updateUserNotifsAsRead,
  updateArticleById,
  saveAndAddArticleToCommunity,
  saveAndAddPollToCommunity,
  addSubscriberToQuestion,
  fetchPollById,
  equipReward,
  incrementProgressForAskedByUser,
  addVoteToPollOption,
  fetchCommunityByObjectId,
  AddQuestionToCommunityModel,
  updateUsersUnlockedFrames,
  notifyUsers,
  closeExpiredPolls,
  updateBlockedTypes,
} from '../models/application';
import {
  Answer,
  Question,
  Tag,
  Comment,
  User,
  NotificationType,
  Notification,
  Article,
  Poll,
  Community,
  UserChallenge,
  Challenge,
  CommunityObjectType,
  PollOption,
} from '../types';
import { T1_DESC, T2_DESC, T3_DESC } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import UserModel from '../models/users';
import CommunityModel from '../models/communities';
import NotificationModel from '../models/notifications';
import ArticleModel from '../models/articles';
import UserChallengeModel from '../models/useChallenge';
import ChallengeModel from '../models/challenges';
import PollModel from '../models/polls';
import PollOptionModel from '../models/pollOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const application = require('../models/application');

const newUser: User = {
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [],
  blockedNotifications: [],
};

const userA: User = {
  _id: new ObjectId('6722970923044fb140958284'),
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [],
  blockedNotifications: [],
};

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: 'com_by1',
  commentDateTime: new Date('2023-11-18T09:25:00'),
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
    subscribers: [],
  },
];

const newCommunity: Community = {
  name: 'Community Name',
  members: [],
  questions: [],
  polls: [],
  articles: [],
};

const communityWithID: Community = {
  _id: new ObjectId('65e9b716ff0e892116b2de14'),
  name: 'Community Name',
  members: [],
  questions: [],
  polls: [],
  articles: [],
};

const communityWithUser: Community = {
  _id: new ObjectId('65e9b716ff0e892116b2de15'),
  name: 'Community Name',
  members: ['UserA'],
  questions: [],
  polls: [],
  articles: [],
};

const questionNotif: Notification = {
  _id: new ObjectId('672e29e54e42e9c421fc2f7c'),
  notificationType: NotificationType.Answer,
  sourceType: 'Question',
  source: QUESTIONS[0],
  isRead: false,
};

const pollNotif: Notification = {
  _id: new ObjectId('672e29e54e42e9c421fc2f7c'),
  notificationType: NotificationType.PollClosed,
  sourceType: 'Poll',
  source: { _id: new ObjectId('672e289cee67e0b36e0ef440') } as Poll,
  isRead: false,
};

const articleNotif: Notification = {
  _id: new ObjectId('672e29e54e42e9c421fc2f7c'),
  notificationType: NotificationType.NewArticle,
  sourceType: 'Article',
  source: { _id: new ObjectId('672e2ba2e4cb291ad8767924') } as Article,
  isRead: false,
};

const rewardNotif: Notification = {
  _id: new ObjectId('672e29e54e42e9c421fc2f7c'),
  notificationType: NotificationType.NewReward,
  isRead: false,
};

const userAWithNotifs: User = {
  _id: new ObjectId('6722970923044fb140958284'),
  username: 'UserA',
  password: 'abc123',
  totalPoints: 0,
  unlockedFrames: [],
  unlockedTitles: [],
  equippedFrame: '',
  equippedTitle: '',
  notifications: [rewardNotif, pollNotif],
  blockedNotifications: [],
};

const challenge1: Challenge = {
  _id: new ObjectId('673d17e54e42e9d121fc2f8d'),
  description: 'challenge1 description',
  actionAmount: 3,
  challengeType: 'question',
  reward: 'some title 1',
};

const challenge2: Challenge = {
  _id: new ObjectId('673d17e54e42e9d121fc2f8e'),
  description: 'challenge2 description',
  actionAmount: 10,
  challengeType: 'question',
  hoursToComplete: 24,
  reward: 'some title 2',
};

const challenge3: Challenge = {
  _id: new ObjectId('673d17e54e42e9d121fc2f8f'),
  description: 'challenge3 description',
  actionAmount: 2,
  challengeType: 'answer',
  reward: 'some title 2',
};

const userChallenge1: UserChallenge = {
  _id: new ObjectId(),
  username: userA.username,
  challenge: challenge1,
  progress: [],
};

const userChallenge2: UserChallenge = {
  _id: new ObjectId(),
  username: userA.username,
  challenge: challenge2,
  progress: [new Date()],
};

const userChallenge3: UserChallenge = {
  _id: new ObjectId(),
  username: userA.username,
  challenge: challenge3,
  progress: [],
};

const expiredUserChallenge: UserChallenge = {
  _id: new ObjectId(),
  username: userA.username,
  challenge: challenge2,
  progress: [new Date(new Date().getTime() - 1000 * 60 * 60 * 25)], // 25 hours old (expired)
};

const completedUserChallenge: UserChallenge = {
  _id: new ObjectId(),
  username: userA.username,
  challenge: challenge1,
  progress: [new Date(), new Date(), new Date()],
};

const almostCompletedUserChallenge: UserChallenge = {
  _id: new ObjectId(),
  username: userA.username,
  challenge: challenge1,
  progress: [new Date(), new Date()],
};

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, 'q_by2');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: 'question3_user',
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
          subscribers: [],
        };

        const result = (await saveQuestion(mockQn)) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy).toEqual(mockQn.askedBy);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });
    });

    describe('addVoteToQuestion', () => {
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });

    describe('addSubscriberToQuestion', () => {
      test('addSubscriberToQuestion should add username as a subscriber to a question', async () => {
        const mockQuestion = { ...QUESTIONS[0] };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, subscribers: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = (await addSubscriberToQuestion('someQuestionId', 'testUser')) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQuestion.title);
        expect(result.text).toEqual(mockQuestion.text);
        expect(result.tags.length).toEqual(mockQuestion.tags.length);
        expect(result.askedBy).toEqual(mockQuestion.askedBy);
        expect(result.askDateTime).toEqual(mockQuestion.askDateTime);
        expect(result.views).toEqual(mockQuestion.views);
        expect(result.answers.length).toEqual(mockQuestion.answers.length);
        expect(result.subscribers).toEqual(['testUser']);
      });

      test('addSubscriberToQuestion should remove username as a subscriber if user was subscribed already', async () => {
        const mockQuestion = { ...QUESTIONS[0], subscribers: ['testUser'] };

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, subscribers: [] },
          'findOneAndUpdate',
        );

        const result = (await addSubscriberToQuestion('someQuestionId', 'testUser')) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQuestion.title);
        expect(result.text).toEqual(mockQuestion.text);
        expect(result.tags.length).toEqual(mockQuestion.tags.length);
        expect(result.askedBy).toEqual(mockQuestion.askedBy);
        expect(result.askDateTime).toEqual(mockQuestion.askDateTime);
        expect(result.views).toEqual(mockQuestion.views);
        expect(result.answers.length).toEqual(mockQuestion.answers.length);
        expect(result.subscribers).toEqual([]);
      });

      test('addSubscriberToQuestion should return an error object if the question to subscribe to not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        const result = await addSubscriberToQuestion('someQuestionId', 'testUser');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addSubscriberToQuestion should return an error object if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS[0], 'findOne');
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addSubscriberToQuestion('someQuestionId', 'testUser');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addSubscriberToQuestion should return an error object if a database error occurs while finding question', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOne');

        const result = await addSubscriberToQuestion('someQuestionId', 'testUser');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addSubscriberToQuestion should return an error object if a database error occurs while updating question', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS[0], 'findOne');
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addSubscriberToQuestion('someQuestionId', 'testUser');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: 'dummyUserId',
          ansDateTime: new Date('2024-06-06'),
          comments: [],
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy).toEqual(mockAnswer.ansBy);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);

        const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

        expect(result.answers.length).toEqual(4);
        expect(result.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: 'user123', // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(Tags).toReturn(new Error('error'), 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(new Error('error'), 'save');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should return default map if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBe(0);
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(Tags).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy).toEqual(com1.commentBy);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: 'user123', // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });
  });

  describe('User model', () => {
    describe('saveUser', () => {
      test('saveUser should return the saved user', async () => {
        const result = (await saveUser(newUser)) as User;

        expect(result._id).toBeDefined();
        expect(result.username).toEqual(newUser.username);
        expect(result.password).toEqual(newUser.password);
        expect(result.totalPoints).toEqual(newUser.totalPoints);
        expect(result.unlockedFrames).toEqual(newUser.unlockedFrames);
        expect(result.unlockedTitles).toEqual(newUser.unlockedTitles);
        expect(result.equippedFrame).toEqual(newUser.equippedFrame);
        expect(result.equippedTitle).toEqual(newUser.equippedTitle);
      });
    });

    describe('findUser', () => {
      it('findUser should return the user if found', async () => {
        const mockUser = { ...newUser, _id: new ObjectId('507f191e810c19729de860eb') };
        mockingoose(UserModel).toReturn(mockUser, 'findOne');

        const result = await findUser(newUser.username);

        expect(result).toBeDefined();
        expect(result?._id).toEqual(mockUser._id);
        expect(result?.username).toEqual(mockUser.username);
        expect(result?.password).toEqual(mockUser.password);
      });
      test('findUser should return null if the user is not found', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = await findUser('nonexistentUser');

        expect(result).toBeNull();
      });
    });

    describe('addPointsToUser', () => {
      test('addPointsToUser should return the updated user', async () => {
        mockingoose(UserModel).toReturn({ ...newUser, totalPoints: 5 }, 'findOneAndUpdate');
        const result = (await addPointsToUser('ValidUserId', 5)) as User;

        expect(result.username).toEqual(newUser.username);
        expect(result.password).toEqual(newUser.password);
        expect(result.totalPoints).toEqual(5);
      });

      test('addPointsToUser should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');
        const result = await addPointsToUser('UserA', 5);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addPointsToUser should return an object with error if findOneAndUpdate returns an error', async () => {
        mockingoose(UserModel).toReturn(new Error('error'), 'findOneAndUpdate');
        const result = await addPointsToUser('UserA', 5);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('updateUsersUnlockedFrames', () => {
      test('updateUsersUnlockedFrames should return the updated user', async () => {
        mockingoose(UserModel).toReturn(
          { ...newUser, unlockedFrames: ['frame1'] },
          'findOneAndUpdate',
        );
        const result = (await updateUsersUnlockedFrames('ValidUserId', ['frame1'])) as User;

        expect(result.username).toEqual(newUser.username);
        expect(result.password).toEqual(newUser.password);
        expect(result.unlockedFrames).toEqual(['frame1']);
      });

      test('updateUsersUnlockedFrames with more than one frame adds all to user', async () => {
        // more of an insurance test as mongoose's $push and $each takes care of adding items from list
        mockingoose(UserModel).toReturn(
          { ...newUser, unlockedFrames: ['frame1', 'frame2', 'frame3'] },
          'findOneAndUpdate',
        );
        const result = (await updateUsersUnlockedFrames('ValidUserId', [
          'frame1',
          'frame2',
          'frame3',
        ])) as User;

        expect(result.username).toEqual(newUser.username);
        expect(result.password).toEqual(newUser.password);
        expect(result.unlockedFrames).toContain('frame1');
        expect(result.unlockedFrames).toContain('frame2');
        expect(result.unlockedFrames).toContain('frame3');
      });

      test('updateUsersUnlockedFrames should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');
        const result = await updateUsersUnlockedFrames('ValidUserId', ['frame1']);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('updateUsersUnlockedFrames should return an object with error if findOneAndUpdate returns an error', async () => {
        mockingoose(UserModel).toReturn(new Error('error'), 'findOneAndUpdate');
        const result = await updateUsersUnlockedFrames('ValidUserId', ['frame1']);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('equipReward', () => {
      test('equipReward with type frame should update user reward and return username, reward type, and equipped reward', async () => {
        mockingoose(UserModel).toReturn(
          { ...newUser, equippedFrame: 'profile_frames-01.png' },
          'findOneAndUpdate',
        );
        const result = (await equipReward('UserA', 'profile_frames-01.png', 'frame')) as {
          username: string;
          reward: string;
          type: string;
        };

        expect(result.username).toEqual(newUser.username);
        expect(result.reward).toEqual('profile_frames-01.png');
        expect(result.type).toEqual('frame');
      });

      test('equipReward with type title should update user reward and return username, reward type, and equipped reward', async () => {
        mockingoose(UserModel).toReturn(
          { ...newUser, equippedTitle: 'Rookie Responder' },
          'findOneAndUpdate',
        );
        const result = (await equipReward('UserA', 'Rookie Responder', 'title')) as {
          username: string;
          reward: string;
          type: string;
        };

        expect(result.username).toEqual(newUser.username);
        expect(result.reward).toEqual('Rookie Responder');
        expect(result.type).toEqual('title');
      });

      test('equipReward should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');
        const result = await equipReward('UserA', 'Rookie Responder', 'title');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('equipReward should return an object with error if findOneAndUpdate returns an error', async () => {
        mockingoose(UserModel).toReturn(new Error('error'), 'findOneAndUpdate');
        const result = await equipReward('UserA', 'Rookie Responder', 'title');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('updateBlockedTypes', () => {
      test('updateBlockedTypes with an initially unblocked type should return the updated user with the type blocked', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        mockingoose(UserModel).toReturn(
          { ...userA, blockedNotifications: [NotificationType.AnswerComment] },
          'findOneAndUpdate',
        );
        const result = (await updateBlockedTypes('UserA', NotificationType.AnswerComment)) as User;

        expect(result.username).toEqual(newUser.username);
        expect(result.password).toEqual(newUser.password);
        expect(result.blockedNotifications).toEqual([NotificationType.AnswerComment]);
      });

      test('updateBlockedTypes with already blocked type return the updated user with the type unblocked', async () => {
        mockingoose(UserModel).toReturn(
          {
            ...userA,
            blockedNotifications: [NotificationType.Upvote, NotificationType.ArticleUpdate],
          },
          'findOne',
        );
        mockingoose(UserModel).toReturn(
          {
            ...userA,
            blockedNotifications: [NotificationType.Upvote],
          },
          'findOneAndUpdate',
        );
        const result = (await updateBlockedTypes('UserA', NotificationType.ArticleUpdate)) as User;

        expect(result.username).toEqual(newUser.username);
        expect(result.password).toEqual(newUser.password);
        expect(result.blockedNotifications).toEqual([NotificationType.Upvote]);
      });

      test('updateBlockedTypes should return an error object if findOne returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');
        const result = await updateBlockedTypes('UserA', NotificationType.ArticleUpdate);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('updateBlockedTypes should return an error object if findOne returns an error', async () => {
        mockingoose(UserModel).toReturn(new Error('error'), 'findOne');
        const result = await updateBlockedTypes('UserA', NotificationType.ArticleUpdate);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('updateBlockedTypes should return an error object if findOneAndUpdate returns null', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await updateBlockedTypes('UserA', NotificationType.ArticleUpdate);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('updateBlockedTypes should return an error object if findOneAndUpdate returns an error', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        mockingoose(UserModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await updateBlockedTypes('UserA', NotificationType.ArticleUpdate);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('Article model', () => {
    describe('fetchArticleById', () => {
      test('fetchArticleById should return an article when called with a valid ID', async () => {
        const mockArticle: Article = {
          _id: new ObjectId('65e9b5a995b6c7045a30d824'),
          title: 'Some Title',
          body: 'Body text',
        };
        mockingoose(ArticleModel).toReturn(mockArticle, 'findOne');

        const result = (await fetchArticleById('65e9b5a995b6c7045a30d824')) as Article;

        expect(result._id?.toString()).toEqual(mockArticle._id?.toString());
        expect(result.title).toEqual(mockArticle.title);
        expect(result.body).toEqual(mockArticle.body);
      });

      test('fetchArticleById should return an error object when findOne returns null', async () => {
        mockingoose(ArticleModel).toReturn(null, 'findOne');

        const result = await fetchArticleById('65e9b5a995b6c7045a30d824');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('fetchArticleById should return an error object when findOne throws an error', async () => {
        mockingoose(ArticleModel).toReturn(new Error('error'), 'findOne');

        const result = await fetchArticleById('65e9b5a995b6c7045a30d824');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('updateArticleById', () => {
      test('updateArticleById should return the updated article if the operation is successful', async () => {
        const mockArticleId = new ObjectId();
        const mockArticle: Article = {
          title: 'new title',
          body: 'new body',
        };

        mockingoose(ArticleModel).toReturn(
          { ...mockArticle, _id: mockArticleId },
          'findOneAndReplace',
        );

        const result = (await updateArticleById(mockArticleId.toString(), mockArticle)) as Article;

        expect(result._id).toBe(mockArticleId);
        expect(result.title).toBe('new title');
        expect(result.body).toBe('new body');
      });
      test('updateArticleById should return and error if findOneAndReplace returns null', async () => {
        const mockArticleId = new ObjectId();
        const mockArticle: Article = {
          title: 'new title',
          body: 'new body',
        };

        mockingoose(ArticleModel).toReturn(null, 'findOneAndReplace');

        const result = await updateArticleById(mockArticleId.toString(), mockArticle);

        if ('error' in result) {
          expect(result.error).toBe('Article not found');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('Community model', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });
    describe('fetchAllCommunities', () => {
      test('should return a list of populated communities when successful', async () => {
        const mockCommunities = [
          {
            _id: new ObjectId(),
            name: 'Community 1',
            members: [],
            questions: [],
            articles: [],
            polls: [],
          },
          {
            _id: new ObjectId(),
            name: 'Community 2',
            members: ['user1'],
            questions: [],
            articles: [],
            polls: [],
          },
        ];

        mockingoose(CommunityModel).toReturn(mockCommunities, 'find');

        jest
          .spyOn(application, 'populateCommunity')
          .mockImplementation(async (...args: unknown[]) => {
            const id = args[0] as string;
            const community = mockCommunities.find(comm => comm._id.toString() === id);
            return community ? { ...community } : { error: 'Community not found' };
          });

        const result = await application.fetchAllCommunities();

        expect(result).toEqual(mockCommunities);
      });
      test('should filter out invalid communities and return valid ones only', async () => {
        const mockCommunities: Array<
          | {
              _id: ObjectId;
              name: string;
              members: string[];
              questions: Question[];
              articles: Article[];
              polls: Poll[];
            }
          | { error: string }
        > = [
          {
            _id: new ObjectId(),
            name: 'Community 1',
            members: [],
            questions: [],
            articles: [],
            polls: [],
          },
          { error: 'Invalid community' },
        ];

        mockingoose(CommunityModel).toReturn(mockCommunities, 'find');

        jest
          .spyOn(application, 'populateCommunity')
          .mockImplementation(async (...args: unknown[]) => {
            const id = args[0] as string;
            const community = mockCommunities.find(
              comm => '_id' in comm && comm._id.toString() === id,
            );
            return community && !(community as any).error
              ? community
              : { error: 'Community not found' };
          });

        const result = await application.fetchAllCommunities();

        expect(result).toEqual([mockCommunities[0]]);
      });
      test('should return an error when fetchAllCommunities fails', async () => {
        mockingoose(CommunityModel).toReturn(new Error('Error fetching communities'), 'find');

        const result = await application.fetchAllCommunities();

        expect(result).toEqual({ error: 'Error when fetching communities' });
      });
    });
    describe('Save community', () => {
      test('Save community should return the saved community', async () => {
        const result = (await saveCommunity(newCommunity)) as Community;

        expect(result._id).toBeDefined();
        expect(result.name).toEqual(newCommunity.name);
        expect(result.members).toEqual(newCommunity.members);
        expect(result.questions).toEqual(newCommunity.questions);
        expect(result.polls).toEqual(newCommunity.polls);
        expect(result.articles).toEqual(newCommunity.articles);
      });

      test('Save community should return an error if create throws an error', async () => {
        jest.spyOn(CommunityModel, 'create').mockRejectedValueOnce(new Error('error from create'));
        const result = await saveCommunity(newCommunity);

        expect(result).toEqual({ error: 'Error when saving a community' });
      });
    });

    describe('Populate community', () => {
      test('populateCommunity should return the populated community when given a valid ID', async () => {
        mockingoose(CommunityModel).toReturn(communityWithID, 'findOne');
        mockingoose(CommunityModel).toReturn(communityWithID, 'populate');
        const result = (await populateCommunity('validCommunityID')) as Community;

        expect(result._id).toEqual(communityWithID._id);
        expect(result.name).toEqual(communityWithID.name);
        expect(result.members).toEqual(communityWithID.members);
        expect(result.questions).toEqual(communityWithID.questions);
        expect(result.polls).toEqual(communityWithID.polls);
        expect(result.articles).toEqual(communityWithID.articles);
      });

      test('populateCommunity should throw an error when given an undefined id', async () => {
        const result = await populateCommunity(undefined);

        expect(result).toEqual({
          error:
            'Error when fetching and populating a community: Provided community ID is undefined.',
        });
      });

      test('populateCommunity should throw an error when findOne returns null', async () => {
        mockingoose(CommunityModel).toReturn(null, 'findOne');
        const result = await populateCommunity('communityID');

        expect(result).toEqual({
          error:
            'Error when fetching and populating a community: Failed to fetch and populate the community',
        });
      });
    });

    describe('addUserToCommunity', () => {
      test('addUserToCommunity should return null if the given user does not exist', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = await addUserToCommunity(
          userA._id!.toString(),
          communityWithUser._id!.toString(),
        );

        expect(result).toBeNull();
      });

      test('addUserToCommunity should return null if the given community does not exist', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        mockingoose(CommunityModel).toReturn(null, 'findOneAndUpdate');

        const result = await addUserToCommunity(
          userA._id!.toString(),
          communityWithUser._id!.toString(),
        );

        expect(result).toBeNull();
      });

      test('addUserToCommunity should return an error on database error', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        mockingoose(CommunityModel).toReturn(new Error('some database error'), 'findOneAndUpdate');

        const result = await addUserToCommunity(
          userA._id!.toString(),
          communityWithUser._id!.toString(),
        );

        expect(result).toEqual({
          error: 'Error when adding user to community: some database error',
        });
      });

      test('addUserToCommunity should return the updated community', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        mockingoose(CommunityModel).toReturn(communityWithUser, 'findOneAndUpdate');

        const result = (await addUserToCommunity(
          userA._id!.toString(),
          communityWithUser._id!.toString(),
        )) as Community;

        expect(result._id).toEqual(communityWithUser._id);
        expect(result.name).toEqual(communityWithUser.name);
        expect(result.members[0]).toEqual(userA.username);
        expect(result.questions).toEqual(communityWithUser.questions);
        expect(result.polls).toEqual(communityWithUser.polls);
        expect(result.articles).toEqual(communityWithUser.articles);
      });
    });

    describe('saveAndAddArticleToCommunity', () => {
      test('saveAndAddArticleToCommunity should return the saved article if the operation is successful', async () => {
        const mockCommunityId = communityWithUser._id!;
        const fixedArticleId = new ObjectId('507f1f77bcf86cd799439012'); // fixed ObjectId

        const mockArticle = {
          title: 'Article Title',
          body: 'Article Body',
        };
        const mockSavedArticle = {
          _id: fixedArticleId,
          ...mockArticle,
        };
        const mockCommunity = { ...communityWithUser, articles: [fixedArticleId] };

        // mock ArticleModel.create to return the fixed article ID
        jest
          .spyOn(ArticleModel, 'create')
          .mockImplementationOnce(() => Promise.resolve(mockSavedArticle as any));
        mockingoose(CommunityModel).toReturn(mockCommunity, 'findOneAndUpdate');

        const result = (await saveAndAddArticleToCommunity(
          mockCommunityId.toString(),
          mockArticle,
        )) as Article;

        expect(result._id?.toString()).toBe(fixedArticleId.toString());
        expect(result.title).toBe(mockArticle.title);
        expect(result.body).toBe(mockArticle.body);
      });
      test('saveAndAddArticleToCommunity should return an error if findOneAndUpdate returns null', async () => {
        const mockCommunityId = new ObjectId();
        const mockArticleId = new ObjectId();
        const mockArticle: Article = {
          title: 'title',
          body: 'body',
        };

        mockingoose(ArticleModel).toReturn({ ...mockArticle, mockArticleId }, 'create');
        mockingoose(CommunityModel).toReturn(null, 'findOneAndUpdate');

        const result = await saveAndAddArticleToCommunity(mockCommunityId.toString(), mockArticle);

        if ('error' in result) {
          expect(result.error).toBe('Community not found');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
    describe('saveAndAddPollToCommunity', () => {
      test('saveAndAddPollToCommunity should return the saved poll if the operation is successful', async () => {
        const mockCommunityId = communityWithUser._id!;
        const fixedPollId = new ObjectId('507f1f77bcf86cd799439011'); // fixed ObjectId

        const mockPoll = {
          title: 'Poll Title',
          options: [
            { text: 'Option 1', usersVoted: [] },
            { text: 'Option 2', usersVoted: [] },
          ],
          createdBy: 'user123',
          pollDateTime: new Date(),
          pollDueDate: new Date(),
          isClosed: false,
        };
        const mockSavedPoll = {
          _id: fixedPollId,
          ...mockPoll,
        };
        const mockCommunity = { ...communityWithUser, polls: [fixedPollId] };

        // mock PollModel.create for the fixed poll ID
        jest
          .spyOn(PollModel, 'create')
          .mockImplementationOnce(() => Promise.resolve(mockSavedPoll as any));

        mockingoose(CommunityModel).toReturn(mockCommunity, 'findOneAndUpdate');

        const result = (await saveAndAddPollToCommunity(
          mockCommunityId.toString(),
          mockPoll,
        )) as Poll;

        expect(result._id?.toString()).toBe(fixedPollId.toString());
        expect(result.title).toBe(mockPoll.title);
        expect(result.options.length).toBe(mockPoll.options.length);
        expect(result.options[0].text).toBe(mockPoll.options[0].text);
        expect(result.options[1].text).toBe(mockPoll.options[1].text);
      });

      test('saveAndAddPollToCommunity should return an error if findOneAndUpdate returns null', async () => {
        const mockCommunityId = new ObjectId();
        const mockPoll = {
          title: 'Poll Title',
          options: [
            { text: 'Option 1', usersVoted: [] },
            { text: 'Option 2', usersVoted: [] },
          ],
          createdBy: 'user123',
          pollDateTime: new Date(),
          pollDueDate: new Date(),
          isClosed: false,
        };
        const mockSavedPoll = { ...mockPoll, _id: new ObjectId() };

        mockingoose(PollModel).toReturn(mockSavedPoll, 'create');
        mockingoose(CommunityModel).toReturn(null, 'findOneAndUpdate');

        const result = await saveAndAddPollToCommunity(mockCommunityId.toString(), mockPoll);

        if ('error' in result) {
          expect(result.error).toBe('Community not found');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
    describe('addQuestionToCommunityModel', () => {
      beforeEach(() => {
        mockingoose.resetAll();
        jest.clearAllMocks();
      });

      test('addQuestionToCommunityModel should return the updated question if the operation is successful', async () => {
        const mockCommunityId = new ObjectId('507f1f77bcf86cd799439010');
        const fixedQuestionId = new ObjectId('507f1f77bcf86cd799439012');

        const mockCommunity = {
          _id: mockCommunityId,
          questions: [fixedQuestionId],
        };
        const mockUpdatedQuestion = {
          _id: fixedQuestionId,
          community: mockCommunityId.toString(),
          text: 'Sample Question',
        };

        const communityUpdateSpy = jest
          .spyOn(CommunityModel, 'findByIdAndUpdate')
          .mockResolvedValue(mockCommunity as any);

        const questionUpdateSpy = jest
          .spyOn(QuestionModel, 'findByIdAndUpdate')
          .mockResolvedValue(mockUpdatedQuestion as any);

        const result = await AddQuestionToCommunityModel(
          mockCommunityId.toString(),
          fixedQuestionId.toString(),
        );

        expect(communityUpdateSpy).toHaveBeenCalledWith(
          mockCommunityId.toString(),
          { $addToSet: { questions: fixedQuestionId.toString() } },
          { new: true },
        );

        expect(questionUpdateSpy).toHaveBeenCalledWith(
          fixedQuestionId.toString(),
          { community: mockCommunityId.toString() },
          { new: true },
        );
        if ('error' in result) {
          expect(false).toBeTruthy();
        } else {
          expect(result._id?.toString()).toBe(fixedQuestionId.toString());
          expect(result.community?.toString()).toBe(mockCommunityId.toString());
          expect(result.text).toBe('Sample Question');
        }
      });
      test('should return an error if the input is invalid', async () => {
        const invalidCommunityId = '';
        const fixedQuestionId = new ObjectId('507f1f77bcf86cd799439012');

        const result = await AddQuestionToCommunityModel(
          invalidCommunityId,
          fixedQuestionId.toString(),
        );

        expect(result).toEqual({ error: 'Community not found' });
      });

      test('should return an error if the community is not found', async () => {
        const mockCommunityId = new ObjectId('507f1f77bcf86cd799439010');
        const fixedQuestionId = new ObjectId('507f1f77bcf86cd799439012');

        jest.spyOn(CommunityModel, 'findByIdAndUpdate').mockResolvedValue(null);

        const result = await AddQuestionToCommunityModel(
          mockCommunityId.toString(),
          fixedQuestionId.toString(),
        );

        expect(result).toEqual({ error: 'Community not found' });
      });

      test('should return an error if the question is not found', async () => {
        const mockCommunityId = new ObjectId('507f1f77bcf86cd799439010');
        const fixedQuestionId = new ObjectId('507f1f77bcf86cd799439012');

        const mockCommunity = {
          _id: mockCommunityId,
          questions: [],
        };

        jest.spyOn(CommunityModel, 'findByIdAndUpdate').mockResolvedValue(mockCommunity as any);
        jest.spyOn(QuestionModel, 'findByIdAndUpdate').mockResolvedValue(null);

        const result = await AddQuestionToCommunityModel(
          mockCommunityId.toString(),
          fixedQuestionId.toString(),
        );

        expect(result).toEqual({ error: 'Question not found' });
      });
    });
  });

  describe('Notification model', () => {
    describe('saveNotification', () => {
      test('saveNotification should return the saved notification', async () => {
        const result = (await saveNotification(questionNotif)) as Notification;

        expect(result._id).toBeDefined();
        expect(result.notificationType).toEqual(questionNotif.notificationType);
        expect(result.sourceType).toEqual(questionNotif.sourceType);
        expect(result.isRead).toEqual(questionNotif.isRead);
      });
    });

    describe('addNotificationToUser', () => {
      test('addNotificationToUser should return the updated user', async () => {
        const updatedUser = { ...userA, notifications: [questionNotif] };
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userA);
        jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(updatedUser);

        const result = (await addNotificationToUser('UserA', questionNotif)) as User;

        expect(result.notifications.length).toEqual(1);
        expect(result.notifications).toContain(questionNotif);
      });

      test('addNotificationToUser should return the user without updating if notification type is in users blocked types', async () => {
        const userWithBlockedType = {
          ...userA,
          blockedNotifications: [NotificationType.PollClosed],
        };
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userWithBlockedType);

        const result = (await addNotificationToUser('UserA', pollNotif)) as User;

        expect(result.username).toEqual('UserA');
        expect(result.notifications.length).toEqual(0);
      });

      test('addNotificationToUser should return an object with error if findOne throws an error', async () => {
        mockingoose(UserModel).toReturn(new Error('error'), 'findOne');

        const result = await addNotificationToUser('UserA', questionNotif);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addNotificationToUser should return an object with error if findOne returns null', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = await addNotificationToUser('UserA', questionNotif);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addNotificationToUser should return an object with error if findOneAndUpdate throws an error', async () => {
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userA);
        mockingoose(UserModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addNotificationToUser('UserA', questionNotif);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addNotificationToUser should return an object with error if findOneAndUpdate returns null', async () => {
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userA);
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const result = await addNotificationToUser('UserA', questionNotif);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addNotificationToUser return an object with error if a required field notificationType is missing ', async () => {
        const invalidNotification: Partial<Notification> = {
          isRead: false, // missing notification type
        };

        const result = await addNotificationToUser('UserA', invalidNotification as Notification);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addNotificationToUser return an object with error if a required field isRead is missing ', async () => {
        const invalidNotification: Partial<Notification> = {
          notificationType: NotificationType.AnswerComment, // missing isRead
        };

        const result = await addNotificationToUser('UserA', invalidNotification as Notification);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('populateNotification', () => {
      test('populateNotification should return the populated question notification when given a valid ID', async () => {
        mockingoose(NotificationModel).toReturn(questionNotif, 'findOne');
        mockingoose(NotificationModel).toReturn(questionNotif, 'populate');
        const result = (await populateNotification(
          '672e29e54e42e9c421fc2f7c',
          'Question',
        )) as Notification;

        expect(result._id).toEqual(questionNotif._id);
        expect(result.notificationType).toEqual(questionNotif.notificationType);
        expect(result.sourceType).toEqual(questionNotif.sourceType);
        expect(result.isRead).toEqual(questionNotif.isRead);
      });

      test('populateNotification should return the populated poll notification when given a valid ID', async () => {
        mockingoose(NotificationModel).toReturn(pollNotif, 'findOne');
        mockingoose(NotificationModel).toReturn(pollNotif, 'populate');
        const result = (await populateNotification(
          '672e29e54e42e9c421fc2f7c',
          'Poll',
        )) as Notification;

        expect(result._id).toEqual(pollNotif._id);
        expect(result.notificationType).toEqual(pollNotif.notificationType);
        expect(result.sourceType).toEqual(pollNotif.sourceType);
        expect(result.isRead).toEqual(pollNotif.isRead);
      });

      test('populateNotification should return the populated article notification when given a valid ID', async () => {
        mockingoose(NotificationModel).toReturn(articleNotif, 'findOne');
        mockingoose(NotificationModel).toReturn(articleNotif, 'populate');
        const result = (await populateNotification(
          '672e29e54e42e9c421fc2f7c',
          'Article',
        )) as Notification;

        expect(result._id).toEqual(articleNotif._id);
        expect(result.notificationType).toEqual(articleNotif.notificationType);
        expect(result.sourceType).toEqual(articleNotif.sourceType);
        expect(result.isRead).toEqual(articleNotif.isRead);
      });

      test('populateNotification with a valid ID and undefined source type should return the notification', async () => {
        mockingoose(NotificationModel).toReturn(rewardNotif, 'findOne');
        const result = (await populateNotification(
          '672e29e54e42e9c421fc2f7c',
          undefined,
        )) as Notification;

        expect(result._id).toEqual(rewardNotif._id);
        expect(result.notificationType).toEqual(rewardNotif.notificationType);
        expect(result.isRead).toEqual(rewardNotif.isRead);
      });

      test('populateNotification should return an error when given an undefined id', async () => {
        const result = await populateNotification(undefined, 'Question');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('populateNotification should return an error when findOne returns null', async () => {
        mockingoose(NotificationModel).toReturn(null, 'findOne');
        const result = await populateNotification('672e29e54e42e9c421fc2f7c', 'Question');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('populateNotification should return an error when findOne returns null', async () => {
        mockingoose(NotificationModel).toReturn(null, 'findOne');
        const result = await populateNotification('672e29e54e42e9c421fc2f7c', 'Question');

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
    describe('updateNotifAsRead', () => {
      test('updateNotifAsRead should return an updated notification when given a valid id', async () => {
        mockingoose(NotificationModel).toReturn(
          { ...rewardNotif, isRead: true },
          'findOneAndUpdate',
        );

        const result = (await updateNotifAsRead(rewardNotif._id?.toString())) as Notification;
        expect(result._id).toEqual(rewardNotif._id);
        expect(result.isRead).toBeTruthy();
      });

      test('updateNotifAsRead should throw an error when given an undefined id', async () => {
        const result = await updateNotifAsRead(undefined);
        expect(result).toEqual({ error: 'Provided notification id is undefined' });
      });

      test('updateNotifAsRead should return an error when findOneAndUpdate returns null', async () => {
        mockingoose(NotificationModel).toReturn(null, 'findOneAndUpdate');
        const result = await updateNotifAsRead(rewardNotif._id?.toString());

        expect(result).toEqual({ error: 'Error when finding and updating the notification' });
      });

      test('updateNotifAsRead should return an error if there is an issue with updating a notification', async () => {
        mockingoose(NotificationModel).toReturn(new Error('Database error'), 'findOneAndUpdate');
        const result = await updateNotifAsRead(rewardNotif._id?.toString());

        expect(result).toEqual({ error: 'Database error' });
      });
    });

    describe('notifyUsers', () => {
      let usersToNotifySpy: jest.SpyInstance;
      let saveNotificationSpy: jest.SpyInstance;
      let addNotificationToUserSpy: jest.SpyInstance;

      beforeEach(() => {
        jest.clearAllMocks();
        usersToNotifySpy = jest.spyOn(application, 'usersToNotify');
        saveNotificationSpy = jest.spyOn(application, 'saveNotification');
        addNotificationToUserSpy = jest.spyOn(application, 'addNotificationToUser');
      });

      test('notifyUsers should add notifications to one user in the database and return list of notified usernames', async () => {
        usersToNotifySpy.mockResolvedValueOnce(['UserA']);
        saveNotificationSpy.mockResolvedValueOnce(questionNotif);
        addNotificationToUserSpy.mockResolvedValueOnce({
          ...userA,
          notifications: [questionNotif],
        });

        const result = (await notifyUsers('validID', questionNotif)) as string[];

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual('UserA');
      });

      test('notifyUsers should add notifications to multiple users in the database and return list of notified usernames', async () => {
        usersToNotifySpy.mockResolvedValueOnce(['UserA', 'UserB']);
        saveNotificationSpy.mockResolvedValueOnce(rewardNotif);
        saveNotificationSpy.mockResolvedValueOnce(rewardNotif);
        addNotificationToUserSpy.mockResolvedValueOnce({
          ...userA,
          notifications: [rewardNotif],
        });
        addNotificationToUserSpy.mockResolvedValueOnce({
          ...userA,
          username: 'UserB',
          notifications: [rewardNotif],
        });

        const result = (await notifyUsers('validID', questionNotif)) as string[];

        expect(result.length).toEqual(2);
        expect(result).toContain('UserA');
        expect(result).toContain('UserB');
        expect(saveNotificationSpy).toHaveBeenCalledTimes(2);
        expect(addNotificationToUserSpy).toHaveBeenCalledTimes(2);
      });

      test('notifyUsers should return error object if object id is undefined', async () => {
        const result = await notifyUsers(undefined, questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('notifyUsers should return error object if `usersToNotify` returns empty list', async () => {
        usersToNotifySpy.mockResolvedValueOnce([]);
        const result = await notifyUsers('validID', questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('notifyUsers should return error object if `usersToNotify` returns error', async () => {
        usersToNotifySpy.mockResolvedValueOnce({ error: 'error' });
        const result = await notifyUsers('validID', questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('notifyUsers should return error object if `saveNotification` returns error', async () => {
        usersToNotifySpy.mockResolvedValueOnce(['UserA']);
        saveNotificationSpy.mockResolvedValueOnce({ error: 'error' });
        const result = await notifyUsers('validID', questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('notifyUsers should return error object if any call to `saveNotification` returns error', async () => {
        usersToNotifySpy.mockResolvedValueOnce(['UserA', 'UserB']);
        saveNotificationSpy.mockResolvedValueOnce(questionNotif);
        saveNotificationSpy.mockResolvedValueOnce({ error: 'error' });
        const result = await notifyUsers('validID', questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('notifyUsers should return error object if `addNotificationToUser` returns error', async () => {
        usersToNotifySpy.mockResolvedValueOnce(['UserA']);
        saveNotificationSpy.mockResolvedValueOnce(questionNotif);
        addNotificationToUserSpy.mockResolvedValueOnce({ error: 'error' });
        const result = await notifyUsers('validID', questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('notifyUsers should return error object if any call to `addNotificationToUser` returns error', async () => {
        usersToNotifySpy.mockResolvedValueOnce(['UserA', 'UserB']);
        saveNotificationSpy.mockResolvedValueOnce(questionNotif);
        addNotificationToUserSpy.mockResolvedValueOnce({
          ...userA,
          notifications: [rewardNotif],
        });
        addNotificationToUserSpy.mockResolvedValueOnce({ error: 'error' });
        const result = await notifyUsers('validID', questionNotif);

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('updateUserNotifsAsRead', () => {
    test('updateUsersNotifsAsRead should return an array of updated notifications when given a valid username', async () => {
      jest.spyOn(application, 'findUser').mockResolvedValueOnce(userAWithNotifs);
      jest
        .spyOn(application, 'updateNotifAsRead')
        .mockResolvedValue({ ...rewardNotif, isRead: true });
      jest
        .spyOn(application, 'updateNotifAsRead')
        .mockResolvedValueOnce({ ...pollNotif, isRead: true });

      const res = (await updateUserNotifsAsRead(userAWithNotifs.username)) as Notification[];
      expect(res[0]._id).toEqual(rewardNotif._id);
      expect(res[1]._id).toEqual(pollNotif._id);
      expect(res[0].isRead).toBeTruthy();
      expect(res[1].isRead).toBeTruthy();
    });

    test('updateUserNotifsAsRead should return an error if the user is not found', async () => {
      jest.spyOn(application, 'findUser').mockResolvedValueOnce(null);
      const res = await updateUserNotifsAsRead(userA.username);

      expect(res).toEqual({ error: 'Error while finding the user' });
    });

    test('updateUserNotifsAsRead should return an error if an error occurs while updating a notification', async () => {
      jest.spyOn(application, 'findUser').mockResolvedValueOnce(userAWithNotifs);
      jest
        .spyOn(application, 'updateNotifAsRead')
        .mockResolvedValueOnce({ error: 'Database Error' });

      const res = await updateUserNotifsAsRead(userA.username);
      expect(res).toEqual({ error: 'Error while updating notification' });
    });
  });

  describe('usersToNotify', () => {
    test('usersToNotify with NotificationType.Answer should return username of question asker', async () => {
      const mockQuestion = { ...QUESTIONS[0], subscribers: ['userA', 'userB', 'userC'] };
      mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
      const result = (await usersToNotify(
        '65e9b58910afe6e94fc6e6dc',
        NotificationType.Answer,
      )) as string[];

      expect(result.length).toEqual(4);
      expect(result.includes('q_by1')).toBeTruthy();
      expect(result.includes('userA')).toBeTruthy();
      expect(result.includes('userB')).toBeTruthy();
      expect(result.includes('userC')).toBeTruthy();
    });

    test('usersToNotify with NotificationType.Comment should return username of question asker', async () => {
      mockingoose(QuestionModel).toReturn(QUESTIONS[0], 'findOne');
      const result = await usersToNotify('65e9b58910afe6e94fc6e6dc', NotificationType.Comment);

      expect(result).toEqual(['q_by1']);
    });

    test('usersToNotify with NotificationType.Upvote should return username of question asker', async () => {
      mockingoose(QuestionModel).toReturn(QUESTIONS[0], 'findOne');
      const result = await usersToNotify('65e9b58910afe6e94fc6e6dc', NotificationType.Upvote);

      expect(result).toEqual(['q_by1']);
    });

    test.each([[NotificationType.Answer], [NotificationType.Comment], [NotificationType.Upvote]])(
      'usersToNotify with %p should throw an error if question not found',
      async notifType => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');
        try {
          await usersToNotify('65e9b58910afe6e94fc6e6dc', notifType);
          expect(false).toBeTruthy();
        } catch (error) {
          expect(true).toBeTruthy();
        }
      },
    );

    test('usersToNotify with NotificationType.AnswerComment should return username of answerer', async () => {
      mockingoose(AnswerModel).toReturn(ans1, 'findOne');
      const result = await usersToNotify(
        '65e9b58910afe6e94fc6e6dc',
        NotificationType.AnswerComment,
      );

      expect(result).toEqual(['ansBy1']);
    });

    test('usersToNotify with NotificationType.AnswerComment should throw an error if question not found', async () => {
      mockingoose(AnswerModel).toReturn(null, 'findOne');
      try {
        await usersToNotify('65e9b58910afe6e94fc6e6dc', NotificationType.AnswerComment);
        expect(false).toBeTruthy();
      } catch (error) {
        expect(true).toBeTruthy();
      }
    });

    test.each([
      [NotificationType.NewQuestion],
      [NotificationType.NewArticle],
      [NotificationType.ArticleUpdate],
      [NotificationType.NewPoll],
    ])('usersToNotify with %p should throw an error if community not found', async notifType => {
      mockingoose(CommunityModel).toReturn(null, 'findOne');
      try {
        await usersToNotify('validID', notifType);
        expect(false).toBeTruthy();
      } catch (error) {
        expect(true).toBeTruthy();
      }
    });

    test.each([
      [NotificationType.NewQuestion],
      [NotificationType.NewArticle],
      [NotificationType.ArticleUpdate],
      [NotificationType.NewPoll],
    ])('usersToNotify with %p should return usernames of community members', async notifType => {
      const communityWithMembers = { ...communityWithID, members: ['UserA', 'UserB', 'UserC'] };
      mockingoose(CommunityModel).toReturn(communityWithMembers, 'findOne');

      const result = await usersToNotify('validID', notifType);

      expect(result).toEqual(['UserA', 'UserB', 'UserC']);
    });

    test('usersToNotify with NotificationType.PollClosed should return usernames of voters in the poll', async () => {
      const mockPollOption = {
        _id: new ObjectId('67352106dc5a3515358f567f'),
        text: 'Poll option 1',
        usersVoted: ['test_user'],
      };
      const mockPoll: Poll = {
        _id: new ObjectId(),
        title: 'Poll title',
        options: [mockPollOption],
        createdBy: 'test_user',
        pollDateTime: new Date(),
        pollDueDate: new Date(),
        isClosed: false,
      };
      mockingoose(PollModel).toReturn(mockPoll, 'findOne');
      mockingoose(PollOptionModel).toReturn(mockPoll, 'populate');

      const result = (await usersToNotify('validID', NotificationType.PollClosed)) as string[];

      expect(result.includes('test_user')).toBeTruthy();
    });

    test('usersToNotify with NotificationType.PollClosed should throw an error if poll not found', async () => {
      mockingoose(PollModel).toReturn(null, 'findOne');
      try {
        await usersToNotify('65e9b58910afe6e94fc6e6dc', NotificationType.PollClosed);
        expect(false).toBeTruthy();
      } catch (error) {
        expect(true).toBeTruthy();
      }
    });

    test('usersToNotify with NotificationType.NewReward should throw an error if user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');
      try {
        await usersToNotify('6722970923044fb140958284', NotificationType.NewReward);
        expect(false).toBeTruthy();
      } catch (error) {
        expect(true).toBeTruthy();
      }
    });

    test('usersToNotify with NotificationType.NewReward should return username of objectIDs user', async () => {
      mockingoose(UserModel).toReturn(userA, 'findOne');

      const result = await usersToNotify('6722970923044fb140958284', NotificationType.NewReward);

      expect(result).toEqual(['UserA']);
    });

    test('usersToNotify with invalid notification type should return an empty array', async () => {
      const result = await usersToNotify('65e9b58910afe6e94fc6e6dc', '' as NotificationType);
      expect(result).toEqual([]);
    });

    test('fetchCommunityByObjectId should return the community that owns the Question', async () => {
      const oid: string = new ObjectId().toString();
      const objectType: CommunityObjectType = 'Question';
      mockingoose(CommunityModel).toReturn(communityWithUser, 'findOne');

      const response: Community = await fetchCommunityByObjectId(oid, objectType);

      expect(response._id).toBe(communityWithUser._id);
    });

    test('fetchCommunityByObjectId should return the community that owns the Article', async () => {
      const oid: string = new ObjectId().toString();
      const objectType: CommunityObjectType = 'Article';
      mockingoose(CommunityModel).toReturn(communityWithUser, 'findOne');

      const response: Community = await fetchCommunityByObjectId(oid, objectType);

      expect(response._id).toBe(communityWithUser._id);
    });

    test('fetchCommunityByObjectId should return the community that owns the Poll', async () => {
      const oid: string = new ObjectId().toString();
      const objectType: CommunityObjectType = 'Poll';
      mockingoose(CommunityModel).toReturn(communityWithUser, 'findOne');

      const response: Community = await fetchCommunityByObjectId(oid, objectType);

      expect(response._id).toBe(communityWithUser._id);
    });

    test('fetchCommunityByObjectId should throw an error if findOne returns null', async () => {
      const oid: string = new ObjectId().toString();
      const objectType: CommunityObjectType = 'Question';
      mockingoose(CommunityModel).toReturn(null, 'findOne');

      try {
        await fetchCommunityByObjectId(oid, objectType);
        expect(false).toBeTruthy();
      } catch (error) {
        expect(true).toBeTruthy();
      }
    });
  });

  describe('Challenge model', () => {
    describe('saveUserChallenge', () => {
      test('should return the UserChallenge if create is successful', async () => {
        mockingoose(UserChallengeModel).toReturn(userChallenge1, 'create');

        const result = (await saveUserChallenge(userChallenge1)) as UserChallenge;

        expect(result._id).toEqual(userChallenge1._id);
        expect(result.challenge).toEqual(challenge1._id);
        expect(result.username).toEqual(userA.username);
        expect(result.progress).toEqual([]);
      });

      test('should return an error if create throws an error', async () => {
        jest
          .spyOn(UserChallengeModel, 'create')
          .mockRejectedValueOnce(new Error('error from create'));

        const result = await saveUserChallenge(userChallenge1);

        if (result && 'error' in result) {
          expect(result.error).toEqual('error from create');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('fetchUserChallengesByUsername', () => {
      test('should return the populated UserChallenges when successful', async () => {
        mockingoose(UserChallengeModel).toReturn([userChallenge1, userChallenge2], 'find');
        mockingoose(UserChallengeModel).toReturn([userChallenge1, userChallenge2], 'populate');

        const result = await fetchUserChallengesByUsername(userA.username);

        if (result && !('error' in result)) {
          expect(result[0]._id).toEqual(userChallenge1._id);
          expect(result[1]._id).toEqual(userChallenge2._id);
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('should return an error if find throws an error', async () => {
        mockingoose(UserChallengeModel).toReturn(new Error('error'), 'find');

        const result = await fetchUserChallengesByUsername(userA.username);

        if (result && 'error' in result) {
          expect(result.error).toEqual('error');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('fetchAndIncrementChallengesByUserAndType', () => {
      test('should return the updated UserChallenges that match the given type', async () => {
        const currentTime = new Date();
        mockingoose(UserModel).toReturn(userA, 'findOne');
        jest
          .spyOn(application, 'fetchUserChallengesByUsername')
          .mockResolvedValueOnce([userChallenge1, userChallenge2, userChallenge3]);

        // no new challenges to initialize UserChallenges for
        mockingoose(ChallengeModel).toReturn([], 'find');

        jest
          .spyOn(UserChallengeModel, 'findOneAndUpdate')
          .mockImplementationOnce(
            () =>
              ({
                populate: jest.fn().mockResolvedValueOnce({
                  ...userChallenge1,
                  progress: [currentTime],
                  challenge: challenge1,
                }) as any,
              }) as any,
          )
          .mockImplementationOnce(
            () =>
              ({
                populate: jest.fn().mockResolvedValueOnce({
                  ...userChallenge2,
                  progress: [...userChallenge2.progress, currentTime],
                  challenge: challenge2,
                }) as any,
              }) as any,
          );

        const result = (await fetchAndIncrementChallengesByUserAndType(
          userA.username,
          'question',
        )) as UserChallenge[];

        // userChallenge3 should not be included because it's challenge has type 'answer'
        expect(result).toHaveLength(2);
        expect(result[0].username).toBe(userA.username);
        expect(result[0].challenge._id).toBe(challenge1._id);
        expect(result[0].progress.length).toBe(1);
        expect(result[1].username).toBe(userA.username);
        expect(result[1].challenge._id).toBe(challenge2._id);
        expect(result[1].progress.length).toBe(2);
      });

      test('should not update the completed UserChallenges', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        jest
          .spyOn(application, 'fetchUserChallengesByUsername')
          .mockResolvedValueOnce([completedUserChallenge]);

        // no new challenges to initialize UserChallenges for
        mockingoose(ChallengeModel).toReturn([], 'find');

        const result = (await fetchAndIncrementChallengesByUserAndType(
          userA.username,
          'question',
        )) as UserChallenge[];

        // Completed challenge should not be included in response
        expect(result).toHaveLength(0);
      });

      test('should remove the expired progress entries from the existing UserChallenges', async () => {
        const currentTime = new Date();
        mockingoose(UserModel).toReturn(userA, 'findOne');
        jest
          .spyOn(application, 'fetchUserChallengesByUsername')
          .mockResolvedValueOnce([expiredUserChallenge]);

        // no new challenges to initialize UserChallenges for
        mockingoose(ChallengeModel).toReturn([], 'find');

        jest.spyOn(UserChallengeModel, 'findOneAndUpdate').mockImplementationOnce(
          () =>
            ({
              populate: jest.fn().mockResolvedValueOnce({
                ...expiredUserChallenge,
                progress: [currentTime],
                challenge: challenge2,
              }) as any,
            }) as any,
        );

        const result = (await fetchAndIncrementChallengesByUserAndType(
          userA.username,
          'question',
        )) as UserChallenge[];

        expect(result).toHaveLength(1);
        expect(result[0].progress.length).toBe(1);
        expect(result[0].progress[0]).toBe(currentTime);
      });

      test('should initialize new UserChallenges for Challenges that dont yet have associated UserChallenges', async () => {
        const currentTime = new Date();
        mockingoose(UserModel).toReturn(userA, 'findOne');
        // No existing UserChallenge records
        jest.spyOn(application, 'fetchUserChallengesByUsername').mockResolvedValueOnce([]);

        // 2 challenges exist, but don't have associated UserChallenge records
        mockingoose(ChallengeModel).toReturn([challenge1, challenge2], 'find');
        jest.spyOn(application, 'saveUserChallenge').mockResolvedValueOnce(userChallenge1);
        jest.spyOn(application, 'saveUserChallenge').mockResolvedValueOnce({
          ...userChallenge2,
          progress: [],
        });
        jest
          .spyOn(UserChallengeModel, 'findOneAndUpdate')
          .mockImplementationOnce(
            () =>
              ({
                populate: jest.fn().mockResolvedValueOnce({
                  ...userChallenge1,
                  progress: [currentTime],
                  challenge: challenge1,
                }) as any,
              }) as any,
          )
          .mockImplementationOnce(
            () =>
              ({
                populate: jest.fn().mockResolvedValueOnce({
                  ...userChallenge2,
                  progress: [currentTime],
                  challenge: challenge2,
                }) as any,
              }) as any,
          );

        const result = (await fetchAndIncrementChallengesByUserAndType(
          userA.username,
          'question',
        )) as UserChallenge[];

        expect(result).toHaveLength(2);
        expect(result[0].challenge._id).toBe(challenge1._id);
        expect(result[1].challenge._id).toBe(challenge2._id);
        expect(result[0].progress.length).toBe(1);
        expect(result[1].progress.length).toBe(1);
      });

      test('should update the users unlocked rewards if a challenge is completed', async () => {
        const currentTime = new Date();
        mockingoose(UserModel).toReturn(userA, 'findOne');
        jest
          .spyOn(application, 'fetchUserChallengesByUsername')
          .mockResolvedValueOnce([almostCompletedUserChallenge]);

        // no new challenges to initialize UserChallenges for
        mockingoose(ChallengeModel).toReturn([], 'find');

        jest.spyOn(UserChallengeModel, 'findOneAndUpdate').mockImplementationOnce(
          () =>
            ({
              populate: jest.fn().mockResolvedValueOnce({
                ...almostCompletedUserChallenge,
                progress: [...almostCompletedUserChallenge.progress, currentTime],
                challenge: challenge1,
              }) as any,
            }) as any,
        );

        const userRewardsUpdateSpy = jest.spyOn(UserModel, 'findOneAndUpdate');

        const result = (await fetchAndIncrementChallengesByUserAndType(
          userA.username,
          'question',
        )) as UserChallenge[];

        expect(result).toHaveLength(1);
        expect(result[0].username).toBe(userA.username);
        expect(result[0].challenge._id).toBe(challenge1._id);
        expect(result[0].progress.length).toBe(3);
        expect(userRewardsUpdateSpy).toHaveBeenCalledWith(
          { username: userA.username },
          {
            $addToSet: { unlockedTitles: challenge1.reward },
          },
        );
      });

      test('should return an error if fetchUserChallengesByUsername throws an error', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        jest
          .spyOn(application, 'fetchUserChallengesByUsername')
          .mockResolvedValueOnce({ error: 'error' });

        const result = await fetchAndIncrementChallengesByUserAndType(userA.username, 'question');

        if ('error' in result) {
          expect(result.error).toBe('error');
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('should return an error if saveUserChallenge throws an error', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        // No existing UserChallenges
        jest.spyOn(application, 'fetchUserChallengesByUsername').mockResolvedValueOnce([]);

        // A challenge exists, but doesn't have an associated UserChallenge record (one must be created)
        mockingoose(ChallengeModel).toReturn([challenge1], 'find');

        jest.spyOn(application, 'saveUserChallenge').mockResolvedValueOnce({ error: 'error' });

        const result = await fetchAndIncrementChallengesByUserAndType(userA.username, 'question');

        if ('error' in result) {
          expect(result.error).toBe('error');
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('should return an error if findOneAndUpdate returns null', async () => {
        mockingoose(UserModel).toReturn(userA, 'findOne');
        jest
          .spyOn(application, 'fetchUserChallengesByUsername')
          .mockResolvedValueOnce([userChallenge1, userChallenge2]);

        // no new challenges to initialize UserChallenges for
        mockingoose(ChallengeModel).toReturn([], 'find');

        mockingoose(UserChallengeModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementChallengesByUserAndType(userA.username, 'question');

        if ('error' in result) {
          expect(result.error).toBe('Error while updating UserChallenges');
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('should return an error if the user does not exist', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const result = await fetchAndIncrementChallengesByUserAndType(userA.username, 'question');

        if ('error' in result) {
          expect(result.error).toBe('User not found');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('incrementProgressForAskedByUser', () => {
      let fetchAndIncrementChallengesByUserAndTypeSpy: jest.SpyInstance;
      beforeEach(() => {
        fetchAndIncrementChallengesByUserAndTypeSpy = jest.spyOn(
          application,
          'fetchAndIncrementChallengesByUserAndType',
        );
      });
      test('should increment a users upvote-related challenges', async () => {
        const mockQuestion = QUESTIONS[0];

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        fetchAndIncrementChallengesByUserAndTypeSpy.mockResolvedValueOnce([userChallenge1]);

        const response = (await incrementProgressForAskedByUser(
          mockQuestion._id!.toString(),
        )) as UserChallenge[];

        expect(response.length).toBe(1);
      });
      test('should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOne');

        const response = await incrementProgressForAskedByUser(new ObjectId().toString());

        if ('error' in response) {
          expect(response.error).toBe('Question not found');
        } else {
          expect(false).toBeTruthy();
        }
      });
      test('should return an error if incrementing progress for the users challenges fails', async () => {
        const mockQuestion = QUESTIONS[0];

        mockingoose(QuestionModel).toReturn(mockQuestion, 'findOne');
        fetchAndIncrementChallengesByUserAndTypeSpy.mockResolvedValueOnce({
          error: 'incrementChallengesError',
        });

        const response = await incrementProgressForAskedByUser(mockQuestion._id!.toString());
        if ('error' in response) {
          expect(response.error).toBe('incrementChallengesError');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('Poll model', () => {
    jest.mock('../models/polls');
    jest.mock('../models/pollOptions');
    describe('fetchPollById', () => {
      test('should return the poll if the operation is successful', async () => {
        const mockPoll: Poll = {
          _id: new ObjectId(),
          title: 'Poll',
          options: [
            {
              _id: new ObjectId(),
              text: 'Option',
              usersVoted: ['me', 'you'],
            },
          ],
          createdBy: 'us',
          pollDateTime: new Date(),
          pollDueDate: new Date(),
          isClosed: false,
        };

        mockingoose(PollModel).toReturn(mockPoll, 'findOne');

        const response = (await fetchPollById(mockPoll._id!.toString())) as Poll;

        expect(response._id?.toString()).toBe(mockPoll._id?.toString());
        expect(response.title).toBe(mockPoll.title);
        expect(response.createdBy).toBe(mockPoll.createdBy);
        expect(response.pollDateTime).toEqual(mockPoll.pollDateTime);
        expect(response.pollDueDate).toEqual(mockPoll.pollDueDate);
      });

      test('should return an error if findOne returns null', async () => {
        const mockPollID = new ObjectId();

        mockingoose(PollModel).toReturn(null, 'findOne');

        const response = await fetchPollById(mockPollID.toString());

        if ('error' in response) {
          expect(response.error).toBe('Poll not found');
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
    describe('addVoteToPollOption', () => {
      let mockPollId: ObjectId;
      let mockOptionId: ObjectId;
      let mockUsername: string;
      let mockPoll: Poll;
      let mockOption: PollOption;
      let updatedOption: PollOption;
      let updatedPoll: Poll;

      beforeEach(() => {
        mockPollId = new ObjectId();
        mockOptionId = new ObjectId();
        mockUsername = 'testUser';

        mockOption = {
          _id: mockOptionId,
          text: 'Option 1',
          usersVoted: [],
        };

        mockPoll = {
          _id: mockPollId,
          title: 'Poll Title',
          options: [mockOption],
          createdBy: 'creatorUser',
          pollDateTime: new Date(),
          pollDueDate: new Date('2100-01-01'),
          isClosed: false,
        };

        updatedOption = {
          ...mockOption,
          usersVoted: [mockUsername],
        };

        updatedPoll = {
          ...mockPoll,
          options: [updatedOption],
        };

        jest.clearAllMocks();
      });

      test('should successfully add a vote to a poll option', async () => {
        // Mock PollModel.findById().populate() to return mockPoll
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(mockPoll),
            }) as any,
        );

        // Mock PollOptionModel.findOneAndUpdate to return updatedOption
        jest.spyOn(PollOptionModel, 'findOneAndUpdate').mockResolvedValueOnce(updatedOption as any);

        // Mock PollModel.findById().populate() to return updatedPoll
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(updatedPoll),
            }) as any,
        );

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toEqual(updatedPoll);
      });

      test('should return an error if the poll does not exist', async () => {
        // Mock PollModel.findById().populate() to return null
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(null),
            }) as any,
        );

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'Poll not found');
      });

      test('should return an error if the user has already voted', async () => {
        // Mock PollModel.findById().populate() to return a poll where user has already voted
        const votedOption = {
          ...mockOption,
          usersVoted: [mockUsername],
        };
        const pollWithVote = {
          ...mockPoll,
          options: [votedOption],
        };

        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(pollWithVote),
            }) as any,
        );

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'User has already voted in this poll');
      });

      test('should return an error if the poll is closed', async () => {
        const closedPoll = {
          ...mockPoll,
          isClosed: true,
        };

        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(closedPoll),
            }) as any,
        );

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'Unable to vote in closed poll');
      });

      test('should return an error if the poll hasnt been closed but the due date has passed', async () => {
        const closedPoll = {
          ...mockPoll,
          pollDueDate: new Date('2023-01-01'),
          isClosed: false,
        };

        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(closedPoll),
            }) as any,
        );

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'Unable to vote in closed poll');
      });

      test('should return an error if the poll option does not exist', async () => {
        // Mock PollModel.findById().populate() to return mockPoll
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(mockPoll),
            }) as any,
        );

        // Mock PollOptionModel.findOneAndUpdate to return null
        jest.spyOn(PollOptionModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'Poll option not found');
      });

      test('should return an error if an exception occurs during database operation', async () => {
        // Mock PollModel.findById().populate() to throw an error
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(() => {
          throw new Error('Database error');
        });

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'Error when adding vote to poll option');
      });

      test('should return an error if username is missing', async () => {
        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          '',
        );

        expect(result).toHaveProperty('error', 'Invalid input data');
      });
      test('should return an error if the updated poll cannot be retrieved', async () => {
        // Mock PollModel.findById().populate() to return mockPoll on the first call
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(mockPoll),
            }) as any,
        );

        jest.spyOn(PollOptionModel, 'findOneAndUpdate').mockResolvedValueOnce(updatedOption as any);

        // Mock PollModel.findById().populate() to return null on the second call
        jest.spyOn(PollModel, 'findById').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve(null),
            }) as any,
        );

        const result = await addVoteToPollOption(
          mockPollId.toString(),
          mockOptionId.toString(),
          mockUsername,
        );

        expect(result).toHaveProperty('error', 'Error retrieving updated poll');
      });
    });

    describe('closeExpiredPolls', () => {
      test('should find an expired poll and return the poll with isClosed updated', async () => {
        const expiredPoll: Poll = {
          _id: new ObjectId(),
          title: 'Test Title',
          options: [],
          createdBy: 'testUser',
          pollDateTime: new Date('01-01-2023'),
          pollDueDate: new Date('01-01-2023'),
          isClosed: false,
        };
        jest.spyOn(PollModel, 'find').mockResolvedValueOnce([expiredPoll]);
        jest.spyOn(PollModel, 'findOneAndUpdate').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve({ ...expiredPoll, isClosed: true }),
            }) as any,
        );

        const result = (await closeExpiredPolls()) as Poll[];

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual(expiredPoll._id?.toString());
        expect(result[0].isClosed).toBeTruthy();
      });

      test('should find multiple expired poll and return all polls with isClosed updated', async () => {
        const expiredPoll1: Poll = {
          _id: new ObjectId(),
          title: 'Test Title',
          options: [],
          createdBy: 'testUser',
          pollDateTime: new Date('01-01-2023'),
          pollDueDate: new Date('01-01-2023'),
          isClosed: false,
        };
        const expiredPoll2: Poll = {
          _id: new ObjectId(),
          title: 'Test Title',
          options: [],
          createdBy: 'testUser',
          pollDateTime: new Date('01-01-2023'),
          pollDueDate: new Date('01-01-2023'),
          isClosed: false,
        };

        jest.spyOn(PollModel, 'find').mockResolvedValueOnce([expiredPoll1, expiredPoll2]);
        jest.spyOn(PollModel, 'findOneAndUpdate').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve({ ...expiredPoll1, isClosed: true }),
            }) as any,
        );
        jest.spyOn(PollModel, 'findOneAndUpdate').mockImplementationOnce(
          () =>
            ({
              populate: () => Promise.resolve({ ...expiredPoll2, isClosed: true }),
            }) as any,
        );

        const result = (await closeExpiredPolls()) as Poll[];

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual(expiredPoll1._id?.toString());
        expect(result[0].isClosed).toBeTruthy();
        expect(result[1]._id?.toString()).toEqual(expiredPoll2._id?.toString());
        expect(result[1].isClosed).toBeTruthy();
      });

      test('should return error object if error thrown by `find`', async () => {
        jest.spyOn(PollModel, 'find').mockResolvedValueOnce(new Error('database error') as any);

        const result = await closeExpiredPolls();

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('should return error object if unable to find any of the polls to update', async () => {
        const expiredPoll1: Poll = {
          _id: new ObjectId(),
          title: 'Test Title',
          options: [],
          createdBy: 'testUser',
          pollDateTime: new Date('01-01-2023'),
          pollDueDate: new Date('01-01-2023'),
          isClosed: false,
        };
        const expiredPoll2: Poll = {
          _id: new ObjectId(),
          title: 'Test Title',
          options: [],
          createdBy: 'testUser',
          pollDateTime: new Date('01-01-2023'),
          pollDueDate: new Date('01-01-2023'),
          isClosed: false,
        };
        jest.spyOn(PollModel, 'find').mockResolvedValueOnce([expiredPoll1, expiredPoll2]);
        jest
          .spyOn(PollModel, 'findOneAndUpdate')
          .mockResolvedValueOnce({ ...expiredPoll1, isClosed: true });
        jest.spyOn(PollModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

        const result = await closeExpiredPolls();

        if ('error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
