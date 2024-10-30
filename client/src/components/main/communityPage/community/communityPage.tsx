import { useNavigate, useParams } from 'react-router-dom';
import { Question, Poll, Article } from '../../../../types';
import './communityPage.css';
import MOCK_COMMUNITIES from '../mockCommunityData';

/**
 * Represents the community page component. Displays the questions, articles, and polls of a community.
 */
const CommunityPage = () => {
  const { communityID } = useParams<{ communityID: string }>();
  const navigate = useNavigate();

  const communityData = MOCK_COMMUNITIES.find(
    community => community._id === String(communityID).trim(),
  );

  if (!communityData) {
    return <p>Community not found.</p>;
  }

  const { name: titleText, questions, polls, articles } = communityData;

  const handleQuestionClick = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  const handleArticleClick = (articleID: string) => {
    navigate(`/community/article/${articleID}`);
  };

  return (
    <div className='community-page'>
      <h1>{titleText}</h1>

      <h2>Community Questions</h2>
      {questions.length > 0 ? (
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
      ) : (
        <p>No questions found.</p>
      )}

      <h2>Community Articles</h2>
      {articles.length > 0 ? (
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
      ) : (
        <p>No articles found.</p>
      )}

      <h2>Community Polls</h2>
      {polls.length > 0 ? (
        <ul>
          {polls.map((poll: Poll) => (
            <li key={poll._id} className='poll-item'>
              {poll.title} - Created by {poll.createdBy.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>No polls found.</p>
      )}
    </div>
  );
};

export default CommunityPage;
