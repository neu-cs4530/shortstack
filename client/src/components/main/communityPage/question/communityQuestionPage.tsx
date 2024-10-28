import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question } from '../../../../types';
import './communityQuestionPage.css';
// Mock data
import mockCommunity from '../mockCommunityData';

const CommunityQuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (questionId) {
      // Using mock data for now
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
