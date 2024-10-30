import { User, Community, Question, Article, Poll, Answer, Comment } from '../../../types';

// Mock data for communities
// Explicitly cast to the types defined in types.ts
const MOCK_COMMUNITIES: Community[] = [
  {
    _id: '1',
    name: 'JavaScript Enthusiasts',
    members: [] as User[], // Empty members array of User type
    questions: [
      {
        _id: '671a4dc9f8cf750f55a6c965',
        title: 'Programmatically navigate using React router',
        text: 'the alert shows the proper index for the li clicked, and when I alert …',
        tags: [
          {
            _id: '671a4dc7f8cf750f55a6c930',
            name: 'react',
            description:
              'React is a JavaScript-based UI development library. Although React is ...',
          },
          {
            _id: '671a4dc8f8cf750f55a6c933',
            name: 'javascript',
            description:
              'JavaScript is a versatile programming language primarily used in web d...',
          },
        ],
        askedBy: 'Joji John',
        askDateTime: new Date('2022-01-20T08:00:00.000+00:00'),
        answers: [
          {
            _id: '671a4dc9f8cf750f55a6c955',
            text: 'React Router is mostly a wrapper around the history library. history h…',
            ansBy: 'hamkalo',
            ansDateTime: new Date('2023-11-20T08:24:42.000+00:00'),
            comments: [
              {
                _id: '671a4dc9f8cf750f55a6c94d',
                text: 'The question about React Router really resonates with me, I faced the ...',
                commentBy: 'ihba001',
                commentDateTime: new Date('2022-02-20T08:00:00.000+00:00'),
              },
            ] as Comment[], // Explicitly cast to Comment array
          },
          {
            _id: '671a4dc9f8cf750f55a6c957',
            text: 'On my end, I like to have a single history object that I can carry eve…',
            ansBy: 'azad',
            ansDateTime: new Date('2023-11-23T13:24:00.000+00:00'),
            comments: [
              {
                _id: '671a4dc9f8cf750f55a6c94d',
                text: 'The question about React Router really resonates with me, I faced the ...',
                commentBy: 'ihba001',
                commentDateTime: new Date('2022-02-20T08:00:00.000+00:00'),
              },
            ] as Comment[], // Explicitly cast to Comment array
          },
        ] as Answer[], // Explicitly cast to Answer array
        views: ['sana', 'abaya', 'alia'],
        upVotes: [],
        downVotes: [],
        comments: [
          {
            _id: '671a4dc9f8cf750f55a6c94d',
            text: 'The question about React Router really resonates with me, I faced the ...',
            commentBy: 'ihba001',
            commentDateTime: new Date('2022-02-20T08:00:00.000+00:00'),
          },
        ] as Comment[], // Explicitly cast to Comment array
      },
    ] as Question[], // Explicitly cast to Question array
    articles: [
      {
        _id: 'a1',
        title: 'Understanding Asynchronous JavaScript',
        body: 'Asynchronous programming is a key part of JavaScript...',
      },
      {
        _id: 'a2',
        title: 'JavaScript ES6 Features',
        body: 'ES6 introduced many new features including let/const, arrow functions...',
      },
    ] as Article[], // Explicitly cast to Article array
    polls: [
      {
        _id: 'poll1',
        title: 'Which JavaScript framework do you prefer?',
        options: [
          { _id: 'opt1', text: 'React', usersVoted: ['User1'] },
          { _id: 'opt2', text: 'Vue', usersVoted: [] },
          { _id: 'opt3', text: 'Angular', usersVoted: ['User2'] },
        ],
        createdBy: {
          _id: 'user2',
          username: 'User2',
          password: '',
          totalPoints: 150,
          unlockedFrames: [],
          unlockedTitles: [],
          equippedFrame: '',
          equippedTitle: '',
        },
        pollDateTime: new Date(),
        pollDueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    ] as Poll[], // Explicitly cast to Poll array
  },
  {
    _id: '2',
    name: 'Python Developers',
    members: [] as User[],
    questions: [] as Question[],
    articles: [] as Article[],
    polls: [] as Poll[],
  },
  {
    _id: '3',
    name: 'Web Dev Wizards',
    members: [] as User[],
    questions: [] as Question[],
    articles: [] as Article[],
    polls: [] as Poll[],
  },
  {
    _id: '4',
    name: 'Data Science Enthusiasts',
    members: [] as User[],
    questions: [] as Question[],
    articles: [] as Article[],
    polls: [] as Poll[],
  },
];

export default MOCK_COMMUNITIES;
