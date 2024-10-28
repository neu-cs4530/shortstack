import { Community } from '../../../types';

const mockCommunity: Community = {
  _id: 'community123',
  name: 'JavaScript Enthusiasts',
  questions: [
    {
      _id: 'q1',
      title: 'What is the difference between var, let, and const?',
      text: 'Can someone explain the main differences?',
      tags: [{ name: 'JavaScript', description: 'Questions about JavaScript' }],
      askedBy: 'User1',
      askDateTime: new Date(),
      answers: [
        {
          _id: 'a1',
          text: 'The main difference is scope. `var` is function-scoped, `let` and `const` are block-scoped.',
          ansBy: 'User3',
          ansDateTime: new Date(),
          comments: [],
        },
        {
          _id: 'a2',
          text: '`const` is also used to declare constants that cannot be reassigned, unlike `let`.',
          ansBy: 'User4',
          ansDateTime: new Date(),
          comments: [],
        },
      ],
      views: ['User2'],
      upVotes: ['User2'],
      downVotes: [],
      comments: [],
    },
  ],
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
  ],
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
  ],
  members: [],
};

export default mockCommunity;
