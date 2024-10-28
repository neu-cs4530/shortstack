import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Question, Poll, Community, Article } from '../types';

const mockCommunity = {
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
      answers: [],
      views: ['User2'],
      upVotes: ['User2'],
      downVotes: [],
      comments: [],
    },
    // Additional questions here...
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
};

/**
 * Custom hook for managing the community page state, fetching community data, and handling real-time updates.
 *
 * @returns titleText - The title of the community page
 * @returns questions - List of questions in the community
 * @returns polls - List of polls in the community
 */
const useCommunityPage = () => {
  const { socket } = useUserContext();
  const [titleText, setTitleText] = useState<string>('Community');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Directly set mock data for testing
    setTitleText(mockCommunity.name);
    setQuestions(mockCommunity.questions || []);
    setPolls(mockCommunity.polls || []);
    setArticles(mockCommunity.articles || []);
  }, []);

  return { titleText, questions, polls, articles };
};

export default useCommunityPage;
