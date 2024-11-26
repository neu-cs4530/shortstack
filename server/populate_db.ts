import mongoose from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import { Answer, Article, Challenge, ChallengeType, Comment, Community, FRAMES, Notification, NotificationType, Poll, PollOption, Question, Tag, User, UserChallenge } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  T1_NAME,
  T1_DESC,
  T2_NAME,
  T2_DESC,
  T3_NAME,
  T3_DESC,
  T4_NAME,
  T4_DESC,
  T5_NAME,
  T5_DESC,
  T6_NAME,
  T6_DESC,
  C1_TEXT,
  C2_TEXT,
  C3_TEXT,
  C4_TEXT,
  C5_TEXT,
  C6_TEXT,
  C7_TEXT,
  C8_TEXT,
  C9_TEXT,
  C10_TEXT,
  C11_TEXT,
  C12_TEXT,
  P1_TITLE,
  P2_TITLE,
  P3_TITLE,
  ART1_TITLE,
  ART1_BODY,
  ART2_TITLE,
  ART2_BODY,
  ART3_TITLE,
  ART3_BODY,
  CHAL1_DESCRIPTION,
  CHAL1_AMT,
  CHAL1_REWARD,
  CHAL2_DESCRIPTION,
  CHAL3_DESCRIPTION,
  CHAL4_DESCRIPTION,
  CHAL2_AMT,
  CHAL2_REWARD,
  CHAL3_REWARD,
  CHAL5_DESCRIPTION,
  CHAL5_AMT,
  CHAL5_REWARD,
  CHAL5_HRS,
  CHAL3_AMT,
  CHAL4_AMT,
  CHAL4_REWARD,
  CHAL6_DESCRIPTION,
  CHAL6_AMT,
  CHAL6_REWARD,
  ART4_TITLE,
  ART4_BODY,
  ART5_TITLE,
  ART5_BODY,
} from './data/posts_strings';
import CommentModel from './models/comments';
import UserModel from './models/users';
import PollModel from './models/polls';
import PollOptionModel from './models/pollOptions';
import NotificationModel from './models/notifications';
import ArticleModel from './models/articles';
import CommunityModel from './models/communities';
import ChallengeModel from './models/challenges';
import UserChallengeModel from './models/useChallenge';

// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Creates a new User document in the database.
 *
 * @param username
 * @param password
 * @param totalPoints
 * @param unlockedFrames
 * @param unlockedTitles
 * @param equippedFrame
 * @param equippedTitle
 * @param notifications
 * @param blockedNotifications
 * @returns A Promise that resolves to the created User document.
 * @throws An error if any of the parameters are invalid.
 */
async function userCreate(
  username: string,
  password: string,
  totalPoints: number,
  unlockedFrames: string[],
  unlockedTitles: string[],
  equippedFrame: string,
  equippedTitle: string,
  notifications: Notification[],
  blockedNotifications: NotificationType[],
): Promise<User> {
  if (username === '' || password === '')
    throw new Error('Invalid User Format');
  const userDetail: User = {
    username: username,
    password: password,
    totalPoints: totalPoints,
    unlockedFrames: unlockedFrames,
    unlockedTitles: unlockedTitles,
    equippedFrame: equippedFrame,
    equippedTitle: equippedTitle,
    notifications: notifications,
    blockedNotifications: blockedNotifications,
  };
  return await UserModel.create(userDetail);
}

/**
 * Creates a new Tag document in the database.
 *
 * @param name The name of the tag.
 * @param description The description of the tag.
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description };
  return await TagModel.create(tag);
}

/**
 * Creates a new Comment document in the database.
 *
 * @param text The content of the comment.
 * @param commentBy The username of the user who commented.
 * @param commentDateTime The date and time when the comment was posted.
 * @returns A Promise that resolves to the created Comment document.
 * @throws An error if any of the parameters are invalid.
 */
async function commentCreate(
  text: string,
  commentBy: string,
  commentDateTime: Date,
): Promise<Comment> {
  if (text === '' || commentBy === '' || commentDateTime == null)
    throw new Error('Invalid Comment Format');
  const commentDetail: Comment = {
    text: text,
    commentBy: commentBy,
    commentDateTime: commentDateTime,
  };
  return await CommentModel.create(commentDetail);
}

/**
 * Creates a new Answer document in the database.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the user who wrote the answer.
 * @param ansDateTime The date and time when the answer was created.
 * @param comments The comments that have been added to the answer.
 * @returns A Promise that resolves to the created Answer document.
 * @throws An error if any of the parameters are invalid.
 */
async function answerCreate(
  text: string,
  ansBy: string,
  ansDateTime: Date,
  comments: Comment[],
): Promise<Answer> {
  if (text === '' || ansBy === '' || ansDateTime == null || comments == null)
    throw new Error('Invalid Answer Format');
  const answerDetail: Answer = {
    text: text,
    ansBy: ansBy,
    ansDateTime: ansDateTime,
    comments: comments,
  };
  return await AnswerModel.create(answerDetail);
}

/**
 * Creates a new Question document in the database.
 *
 * @param title The title of the question.
 * @param text The content of the question.
 * @param tags An array of tags associated with the question.
 * @param answers An array of answers associated with the question.
 * @param askedBy The username of the user who asked the question.
 * @param askDateTime The date and time when the question was asked.
 * @param views An array of usernames who have viewed the question.
 * @param comments An array of comments associated with the question.
 * @returns A Promise that resolves to the created Question document.
 * @throws An error if any of the parameters are invalid.
 */
async function questionCreate(
  title: string,
  text: string,
  tags: Tag[],
  answers: Answer[],
  askedBy: string,
  askDateTime: Date,
  views: string[],
  comments: Comment[],
  subscribers: string[],
): Promise<Question> {
  if (
    title === '' ||
    text === '' ||
    tags.length === 0 ||
    askedBy === '' ||
    askDateTime == null ||
    comments == null
  )
    throw new Error('Invalid Question Format');
  const questionDetail: Question = {
    title: title,
    text: text,
    tags: tags,
    askedBy: askedBy,
    answers: answers,
    views: views,
    askDateTime: askDateTime,
    upVotes: [],
    downVotes: [],
    comments: comments,
    subscribers: subscribers,
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Creates a new PollOption document in the database.
 *
 * @param text
 * @param usersVoted
 * @returns A Promise that resolves to the created PollOption document.
 * @throws An error if any of the parameters are invalid.
 */
async function pollOptionCreate(
  text: string,
  usersVoted: string[],
): Promise<PollOption> {
  if (text === '')
    throw new Error('Invalid PollOption Format');
  const pollOptionDetail: PollOption = {
    text: text,
    usersVoted: usersVoted,
  };
  return await PollOptionModel.create(pollOptionDetail);
}

/**
 * Creates a new Poll document in the database.
 *
 * @param title
 * @param options
 * @param createdBy
 * @param pollDateTime
 * @param pollDueDate
 * @param isClosed
 * @returns A Promise that resolves to the created Poll document.
 * @throws An error if any of the parameters are invalid.
 */
async function pollCreate(
  title: string,
  options: PollOption[],
  createdBy: string,
  pollDateTime: Date,
  pollDueDate: Date,
  isClosed: boolean,
): Promise<Poll> {
  if (
    title === '' ||
    options.length === 0 ||
    createdBy == '' ||
    pollDateTime == null ||
    pollDueDate == null
  )
    throw new Error('Invalid Poll Format');
  const pollDetail: Poll = {
    title: title,
    options: options,
    createdBy: createdBy,
    pollDateTime: pollDateTime,
    pollDueDate: pollDueDate,
    isClosed: isClosed,
  };
  return await PollModel.create(pollDetail);
}

/**
 * Creates a new Article document in the database.
 *
 * @param title
 * @param body
 * @returns A Promise that resolves to the created Article document.
 * @throws An error if any of the parameters are invalid.
 */
async function articleCreate(
  title: string,
  body: string,
  createdDate: Date,
  latestEditDate: Date,
): Promise<Article> {
  if (title === '' || body === '')
    throw new Error('Invalid Article Format');
  const articleDetail: Article = {
    title: title,
    body: body,
    createdDate,
    latestEditDate
  };
  return await ArticleModel.create(articleDetail);
}

/**
 * Creates a new Community document in the database.
 *
 * @param name
 * @param members
 * @param questions
 * @param polls
 * @param articles
 * @returns A Promise that resolves to the created Community document.
 * @throws An error if any of the parameters are invalid.
 */
async function communityCreate(
  name: string,
  members: string[],
  questions: Question[],
  polls: Poll[],
  articles: Article[],
): Promise<Community> {
  if (name === '' || members.length === 0)
    throw new Error('Invalid Community Format');
  const communityDetail: Community = {
    name: name,
    members: members,
    questions: questions,
    polls: polls,
    articles: articles,
  };
  return await CommunityModel.create(communityDetail);
}

/**
 * Creates a new Notification document in the database.
 *
 * @param notificationType
 * @param sourceType
 * @param source
 * @param isRead
 * @returns A Promise that resolves to the created Notification document.
 * @throws An error if any of the parameters are invalid.
 */
async function notificationCreate(
  notificationType: NotificationType,
  isRead: boolean,
  sourceType?: 'Question' | 'Poll' | 'Article',
  source?: Question | Poll | Article,
): Promise<Notification> {
  if (!notificationType || isRead === undefined || isRead == null)
    throw new Error('Invalid Notification Format');
  const notificationDetail: Notification = {
    notificationType: notificationType,
    sourceType: sourceType,
    source: source,
    isRead: isRead,
  };
  return await NotificationModel.create(notificationDetail);
}

/**
 * Creates a new Challenge document in the database.
 * 
 * @param description 
 * @param actionAmount 
 * @param challengeType 
 * @param hoursToComplete 
 * @param reward 
 * @returns A Promise that resolves to the created Challenge document.
 * @throws An error if any of the parameters are invalid.
 */
async function challengeCreate(
  description: string,
  actionAmount: number,
  challengeType: ChallengeType,
  reward: string,
  hoursToComplete?: number,
): Promise<Challenge> {
  if (!challengeType) {
    throw new Error('Invalid Challenge Format');
  }
  const challengeDetail: Challenge = {
    description,
    actionAmount,
    challengeType,
    hoursToComplete,
    reward,
  };
  return await ChallengeModel.create(challengeDetail);
}

/**
 * Creates a new UserChallenge document in the database.
 * 
 * @param username 
 * @param challenge 
 * @param progress 
 * @returns A Promise that resolves to the created UserChallenge document.
 * @throws An error if any of the parameters are invalid.
 */
async function userChallengeCreate(
  username: string,
  challenge: Challenge,
  progress: Date[],
): Promise<UserChallenge> {
  if (!username || !challenge) {
    throw new Error('Invalid UserChallenge Format');
  }
  const userChallengeDetail: UserChallenge = {
    username,
    challenge,
    progress,
  };
  return await UserChallengeModel.create(userChallengeDetail);
}

/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    const t1 = await tagCreate(T1_NAME, T1_DESC);
    const t2 = await tagCreate(T2_NAME, T2_DESC);
    const t3 = await tagCreate(T3_NAME, T3_DESC);
    const t4 = await tagCreate(T4_NAME, T4_DESC);
    const t5 = await tagCreate(T5_NAME, T5_DESC);
    const t6 = await tagCreate(T6_NAME, T6_DESC);

    const c1 = await commentCreate(C1_TEXT, 'Joji John', new Date('2023-12-12T03:30:00'));
    const c2 = await commentCreate(C2_TEXT, 'abhi3241', new Date('2023-12-01T15:24:19'));
    const c3 = await commentCreate(C3_TEXT, 'saltyPeter', new Date('2023-12-18T09:24:00'));
    const c4 = await commentCreate(C4_TEXT, 'monkeyABC', new Date('2023-12-20T03:24:42'));
    const c5 = await commentCreate(C5_TEXT, 'mackson3332', new Date('2023-12-23T08:24:00'));
    const c6 = await commentCreate(C6_TEXT, 'alia', new Date('2023-12-22T17:19:00'));
    const c7 = await commentCreate(C7_TEXT, 'saltyPeter', new Date('2023-12-22T21:17:53'));
    const c8 = await commentCreate(C8_TEXT, 'alia', new Date('2023-12-19T18:20:59'));
    const c9 = await commentCreate(C9_TEXT, 'abaya', new Date('2022-02-20T03:00:00'));
    const c10 = await commentCreate(C10_TEXT, 'elephantCDE', new Date('2023-02-10T11:24:30'));
    const c11 = await commentCreate(C11_TEXT, 'Joji John', new Date('2023-03-18T01:02:15'));
    const c12 = await commentCreate(C12_TEXT, 'abaya', new Date('2023-04-10T14:28:01'));

    const a1 = await answerCreate(A1_TXT, 'elephantCDE', new Date('2023-11-20T03:24:42'), [c1]);
    const a2 = await answerCreate(A2_TXT, 'abaya', new Date('2023-11-23T08:24:00'), [c2]);
    const a3 = await answerCreate(A3_TXT, 'abaya', new Date('2023-11-18T09:24:00'), [c3]);
    const a4 = await answerCreate(A4_TXT, 'alia', new Date('2023-11-12T03:30:00'), [c4]);
    const a5 = await answerCreate(A5_TXT, 'abhi3241', new Date('2023-11-01T15:24:19'), [c5]);
    const a6 = await answerCreate(A6_TXT, 'abhi3241', new Date('2023-02-19T18:20:59'), [c6]);
    const a7 = await answerCreate(A7_TXT, 'mackson3332', new Date('2023-02-22T17:19:00'), [c7]);
    const a8 = await answerCreate(A8_TXT, 'Joji John', new Date('2023-03-22T21:17:53'), [c8]);

    const Q1 = await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      'Joji John',
      new Date('2022-01-20T03:00:00'),
      ['abaya', 'alia'],
      [c9],
      [],
    );
    const Q2 = await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [a3, a4, a5],
      'saltyPeter',
      new Date('2023-01-10T11:24:30'),
      ['mackson3332'],
      [c10],
      ['monkeyABC', 'elephantCDE'],
    );
    const Q3 = await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [a6, a7],
      'monkeyABC',
      new Date('2023-02-18T01:02:15'),
      ['monkeyABC', 'elephantCDE'],
      [c11],
      ['abaya', 'Joji John', 'alia'],
    );
    const Q4 = await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      'elephantCDE',
      new Date('2023-03-10T14:28:01'),
      [],
      [c12],
      ['abhi3241'],
    );

    const N1_1 = await notificationCreate(NotificationType.Answer, false, 'Question', Q3);
    const N1_2 = await notificationCreate(NotificationType.Answer, true, 'Question', Q3);
    const N1_3 = await notificationCreate(NotificationType.Answer, true, 'Question', Q3);
    const N1_4 = await notificationCreate(NotificationType.Answer, false, 'Question', Q3);
    const N2_1 = await notificationCreate(NotificationType.Comment, true, 'Question', Q2);
    const N2_2 = await notificationCreate(NotificationType.Comment, false, 'Question', Q2);
    const N2_3 = await notificationCreate(NotificationType.Comment, true, 'Question', Q2);
    const N3_1 = await notificationCreate(NotificationType.AnswerComment, false, 'Question', Q1);
    const N3_2 = await notificationCreate(NotificationType.AnswerComment, false, 'Question', Q1);
    const N4_1 = await notificationCreate(NotificationType.Upvote, true, 'Question', Q3);
    const N4_2 = await notificationCreate(NotificationType.Upvote, false, 'Question', Q3);
    const N5_1 = await notificationCreate(NotificationType.NewQuestion, false, 'Question', Q4);
    const N5_2 = await notificationCreate(NotificationType.NewQuestion, true, 'Question', Q4);
    const N6_1 = await notificationCreate(NotificationType.NewReward, false);
    const N6_2 = await notificationCreate(NotificationType.NewReward, false);
    const N6_3 = await notificationCreate(NotificationType.NewReward, true);

    const U1 = await userCreate('Joji John', 'qwertyu', 50, [], [CHAL1_REWARD, CHAL2_REWARD], '', CHAL1_REWARD, [N1_1, N2_1], []);
    const U2 = await userCreate('saltyPeter', 'abc123', 990, [FRAMES[0].name], [CHAL1_REWARD, CHAL3_REWARD], '', CHAL3_REWARD, [N3_1, N4_1, N1_2, N2_2], []);
    const U3 = await userCreate('abhi3241', 'se35ls($knf^%^gxe', 30, [], [], '', '', [N5_1, N6_1], []);
    const U4 = await userCreate('alia', 'OverflowAccount', 0, [], [], '', '', [], []);
    const U5 = await userCreate('monkeyABC', 'password', 20, [], [], '', '', [N1_3, N5_2], []);
    const U6 = await userCreate('elephantCDE', 'elephantsForLife', 4998, [FRAMES[0].name, FRAMES[1].name], [CHAL1_REWARD, CHAL3_REWARD], '', '', [N6_2, N1_4, N4_2, N6_3], []);
    const U7 = await userCreate('abaya', '1234567890', 150, [], [], '', '', [N2_3], []);
    const U8 = await userCreate('mackson3332', 'verystronglongpassword', 30, [], [], '', '', [N3_2], []);

    const po1_promise = [
      pollOptionCreate('Windows', [U2.username, U3.username]), 
      pollOptionCreate('macOS', [U4.username, U5.username, U7.username]), 
      pollOptionCreate('Linux', []), 
      pollOptionCreate('Other', []),
    ];
    const p1_options = await Promise.all(po1_promise);

    const po2_promise = [
      pollOptionCreate('Pyton', [U4.username, U5.username]), 
      pollOptionCreate('JavaScript', []), 
      pollOptionCreate('Java', []), 
      pollOptionCreate('Rust', [U6.username]),
      pollOptionCreate('Go', [U7.username]),
      pollOptionCreate('Other', []),
    ];
    const p2_options = await Promise.all(po2_promise);

    const po3_promise = [
      pollOptionCreate('Static Typing (e.g., Java, TypeScript)', [U1.username, U2.username, U7.username, U8.username]), 
      pollOptionCreate('Dynamic Typing (e.g., Python, JavaScript)', [U5.username, U6.username]),
    ];
    const p3_options = await Promise.all(po3_promise);

    const P1 = await pollCreate(P1_TITLE, p1_options, U1.username, new Date('2024-10-30'), new Date('2024-12-06'), false);
    const P2 = await pollCreate(P2_TITLE, p2_options, U2.username, new Date(), new Date('2024-11-23'), false);
    const P3 = await pollCreate(P3_TITLE, p3_options, U3.username, new Date(), new Date('2024-11-11'), true);

    const ART1 = await articleCreate(ART1_TITLE, ART1_BODY, new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), new Date());
    const ART2 = await articleCreate(ART2_TITLE, ART2_BODY, new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), new Date(Date.now() - 60 * 1000));
    const ART3 = await articleCreate(ART3_TITLE, ART3_BODY, new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), new Date(Date.now() - 1 * 24 * 60 * 60 * 1000));
    const ART4 = await articleCreate(ART4_TITLE, ART4_BODY, new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), new Date(Date.now() - 60 * 60 * 1000));
    const ART5 = await articleCreate(ART5_TITLE, ART5_BODY, new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), new Date(Date.now() - 30 * 60 * 1000));

    // community notifications
    const N7 = await notificationCreate(NotificationType.NewPoll, true, 'Poll', P2);
    const N8 = await notificationCreate(NotificationType.PollClosed, false, 'Poll', P3);
    const N9 = await notificationCreate(NotificationType.NewArticle, false, 'Article', ART3);
    const N10 = await notificationCreate(NotificationType.ArticleUpdate, true, 'Article', ART2);

    const U9 = await userCreate('communityMember', 'pass1234', 0, [], [], '', '', [N7, N8, N9, N10], []);

    await communityCreate('Tech Enthusiasts', [U1, U2, U3, U4, U9].map(u => u.username), [Q4], [P1], [ART1, ART2, ART4, ART5]);
    await communityCreate('CS Majors', [U4, U5, U6, U7, U9].map(u => u.username), [Q1, Q2, Q3], [P2, P3], [ART3]);
    await communityCreate('Northeastern CS4950', [U8, U4].map(u => u.username), [], [], []);

    // challenges
    const CHAL1 = await challengeCreate(CHAL1_DESCRIPTION, CHAL1_AMT, 'answer', CHAL1_REWARD);
    const CHAL2 = await challengeCreate(CHAL2_DESCRIPTION, CHAL2_AMT, 'answer', CHAL2_REWARD);
    const CHAL3 = await challengeCreate(CHAL3_DESCRIPTION, CHAL3_AMT, 'question', CHAL3_REWARD);
    const CHAL4 = await challengeCreate(CHAL4_DESCRIPTION, CHAL4_AMT, 'question', CHAL4_REWARD);
    const CHAL5 = await challengeCreate(CHAL5_DESCRIPTION, CHAL5_AMT, 'answer', CHAL5_REWARD, CHAL5_HRS);
    const CHAL6 = await challengeCreate(CHAL6_DESCRIPTION, CHAL6_AMT, 'upvote', CHAL6_REWARD);

    // user challenge records
    const currentDate = new Date();
    const fiveDates = [currentDate, currentDate, currentDate, currentDate, currentDate];
    const tenDates = [...fiveDates, ...fiveDates];
    await userChallengeCreate(U1.username, CHAL1, [currentDate]); // completed (1/1)
    await userChallengeCreate(U1.username, CHAL2, tenDates); // completed (10/10)
    // CHAL3 in progress for U1 (0/1) (UserChallenge record hasn't been initialized)
    // CHAL4 in progress for U1 (0/5) (UserChallenge record hasn't been initialized)

    // this challenge is dependent on current date, so progress made will depend on how long ago populate() was called.
    await userChallengeCreate(U1.username, CHAL5, fiveDates); // in progress (5/10)

    await userChallengeCreate(U2.username, CHAL1, [currentDate]); // completed (1/1)
    await userChallengeCreate(U2.username, CHAL2, fiveDates); // in progress (5/10)
    await userChallengeCreate(U2.username, CHAL3, [currentDate]); // completed (1/1)
    await userChallengeCreate(U2.username, CHAL4, [currentDate]); // in progress (1/5)
    await userChallengeCreate(U2.username, CHAL5, []); // in progress (0/10)
    await userChallengeCreate(U2.username, CHAL6, [...tenDates, ...tenDates]) // in progress (20/25) (upvotes)

    await userChallengeCreate(U6.username, CHAL1, [currentDate]); // completed (1/1)
    await userChallengeCreate(U6.username, CHAL2, [...fiveDates, currentDate, currentDate, currentDate, currentDate]); // in progress (9/10)
    await userChallengeCreate(U6.username, CHAL3, [currentDate]); // completed (1/1)
    await userChallengeCreate(U6.username, CHAL4, [currentDate]); // in progress (1/5)
    await userChallengeCreate(U6.username, CHAL5, []); // in progress (0/10)
    await userChallengeCreate(U6.username, CHAL6, [...tenDates, ...tenDates, currentDate, currentDate, currentDate]) // in progress (23/25) (upvotes)

    console.log('Database populated');
  } catch (err) {
    console.log('ERROR: ' + err);
  } finally {
    if (db) db.close();
    console.log('done');
  }
};

populate();

console.log('Processing ...');
