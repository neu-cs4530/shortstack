import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../../../../types';
import './communityArticlePage.css';

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

const CommunityArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (articleId) {
      // Find the article in mockCommunity
      const foundArticle = mockCommunity.articles.find(a => a._id === articleId);
      setArticle(foundArticle || null);
    }
  }, [articleId]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className='community-article-page'>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
    </div>
  );
};

export default CommunityArticlePage;
