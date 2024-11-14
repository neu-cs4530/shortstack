import { useNavigate } from 'react-router-dom';
import { PiNotePencil } from 'react-icons/pi';
import { Question, Poll, Article } from '../../../../types';
import './communityPage.css';
import useCommunityPage from '../../../../hooks/useCommunityPage';
import CommunityArticleForm from './article/communityArticleForm';

/**
 * Represents the community page component. Displays the questions, articles, and polls of a community.
 */
const CommunityPage = () => {
  const {
    communityID,
    titleText,
    questions,
    polls,
    articles,
    canEdit,
    isCreatingArticle,
    toggleCreateArticleForm,
    setArticles,
  } = useCommunityPage();
  const navigate = useNavigate();

  const handleQuestionClick = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  const handleArticleClick = (articleID: string) => {
    navigate(`/community/article/${articleID}`);
  };

  const handleCreatePollClick = () => {
    navigate(`/community/${communityID}/createPoll`);
  };

  return isCreatingArticle ? (
    <div className='article-form-container'>
      <CommunityArticleForm
        communityId={communityID}
        toggleEditMode={toggleCreateArticleForm}
        submitCallback={(newArticle: Article) => {
          setArticles([...articles, newArticle]);
          toggleCreateArticleForm();
        }}
      />
    </div>
  ) : (
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

      <div className='header-container'>
        <h2 style={{ marginBottom: '0' }}>Community Articles</h2>
        {canEdit && (
          <button className='new-article-button' onClick={toggleCreateArticleForm}>
            <PiNotePencil style={{ marginRight: '5px' }} /> New Article
          </button>
        )}
      </div>
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

      <div className='header-container'>
        <h2 style={{ marginBottom: '0' }}>Community Polls</h2>
        {canEdit && (
          <button className='create-poll-button' onClick={handleCreatePollClick}>
            <PiNotePencil style={{ marginRight: '5px' }} /> Create Poll
          </button>
        )}
      </div>
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
