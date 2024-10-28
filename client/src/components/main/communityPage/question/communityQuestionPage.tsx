import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question } from '../../../../types';
import './communityQuestionPage.css';

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
};

const CommunityQuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (questionId) {
      const foundQuestion = mockCommunity.questions.find(q => q._id === questionId);
      setQuestion(foundQuestion || null);
    }
  }, [questionId]);

  if (!question) return <div>Loading...</div>;

  return (
    <div className='community-question-page'>
      <h2>{question.title}</h2>
      <p className='question-text'>{question.text}</p>
      <div className='question-meta'>
        <strong>Asked by:</strong> {question.askedBy}
        <span> | </span>
        <strong>Views:</strong> {question.views.length}
      </div>
      <div className='question-tags'>
        <strong>Tags:</strong>{' '}
        {question.tags.map((tag, idx) => (
          <span key={idx} className='question-tag'>
            {tag.name}
          </span>
        ))}
      </div>

      <div className='answers-section'>
        <h3>Answers</h3>
        {question.answers.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          question.answers.map(answer => (
            <div key={answer._id} className='answer'>
              <p>{answer.text}</p>
              <div className='answer-meta'>
                <strong>Answered by:</strong> {answer.ansBy}
                <span> | </span>
                <strong>Date:</strong> {answer.ansDateTime.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityQuestionPage;
