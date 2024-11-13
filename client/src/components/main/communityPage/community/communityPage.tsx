import { useNavigate } from 'react-router-dom';
import { Question, Poll, Article } from '../../../../types';
import './communityPage.css';
import useCommunityPage from '../../../../hooks/useCommunityPage';
import QuestionView from '../../questionPage/question';

/**
 * Represents the community page component. Displays the questions, articles, and polls of a community.
 */
const CommunityPage = () => {
  const { titleText, questions, polls, articles } = useCommunityPage();
  const navigate = useNavigate();

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
            <li key={question._id} className='question-item'>
              <QuestionView q={question} />
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
              {poll.title} - Created by {poll.createdBy}
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
