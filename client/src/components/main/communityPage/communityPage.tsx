import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, Poll, Article } from '../../../types';
import useCommunityPage from '../../../hooks/useCommunityPage';
import './communityPage.css';

const CommunityPage = () => {
  const { titleText, questions, polls, articles } = useCommunityPage();
  const navigate = useNavigate();

  const handleQuestionClick = (questionID: string) => {
    navigate(`/community/question/${questionID}`);
  };

  const handleArticleClick = (articleID: string) => {
    navigate(`/community/article/${articleID}`);
  };

  return (
    <div className='community-page'>
      <h1>{titleText}</h1>

      <h2>Community Questions</h2>
      <ul>
        {questions.map((question: Question) => (
          <li
            key={question._id}
            className='question-item'
            onClick={() => handleQuestionClick(question._id!)}>
            {question.title} - Asked by {question.askedBy}
          </li>
        ))}
      </ul>

      <h2>Community Articles</h2>
      <ul>
        {articles.map((article: Article) => (
          <li
            key={article._id}
            className='article-item'
            onClick={() => handleArticleClick(article._id!)}>
            {article.title}
          </li>
        ))}
      </ul>

      <h2>Community Polls</h2>
      <ul>
        {polls.map((poll: Poll) => (
          <li key={poll._id}>
            {poll.title} - Created by {poll.createdBy.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityPage;
