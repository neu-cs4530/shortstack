import { useNavigate } from 'react-router-dom';
import { PiNotePencil } from 'react-icons/pi';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Question, Poll, Article } from '../../../../types';
import './communityPage.css';
import useCommunityPage from '../../../../hooks/useCommunityPage';
import CommunityArticleForm from './article/communityArticleForm';
import CommunityBreadcrumb from './breadcrumb/communityBreadcrumb';
import QuestionView from '../../questionPage/question';

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
    currentTab,
    setCurrentTab,
    searchBarValue,
    handleInputChange,
    searchedAndSortedArticles,
    articleSortOption,
    handleChangeArticleSortOption,
  } = useCommunityPage();
  const navigate = useNavigate();

  const handleArticleClick = (articleID: string) => {
    navigate(`/community/article/${articleID}`);
  };

  const handlePollClick = (pollID: string) => {
    navigate(`/community/poll/${pollID}`);
  };

  const handleCreatePollClick = () => {
    navigate(`/community/${communityID}/createPoll`);
  };

  /**
   * Function that renders the appropriate content based on the current community tab.
   * @returns A div containing the html code for the appropriate content.
   */
  const renderContentType = () => {
    if (currentTab === 'Questions') {
      return (
        <div className='community-content'>
          <div className='header-container'>
            <h2>Community Questions</h2>
          </div>
          <hr />
          {questions.length > 0 ? (
            <>
              {questions.map((question: Question) => (
                <QuestionView q={question} key={question._id} />
              ))}
            </>
          ) : (
            <p>No questions found.</p>
          )}
        </div>
      );
    }

    if (currentTab === 'Articles') {
      return (
        <div className='community-content'>
          <div className='header-container'>
            <h2 style={{ marginBottom: '0' }}>Community Articles</h2>
            <div className='header-buttons'>
              {canEdit && (
                <button className='article-button' onClick={toggleCreateArticleForm}>
                  <PiNotePencil style={{ marginRight: '5px' }} /> New Article
                </button>
              )}
              <input
                id='searchBar'
                placeholder='Search ...'
                type='text'
                value={searchBarValue}
                onChange={handleInputChange}
              />
              <FormControl className='sort-dropdown' size='small' sx={{ m: 1, minWidth: 160 }}>
                <InputLabel>Sort by:</InputLabel>
                <Select
                  label='Sort by:'
                  value={articleSortOption}
                  onChange={handleChangeArticleSortOption}>
                  <MenuItem value='Newest'>Newest</MenuItem>
                  <MenuItem value='Oldest'>Oldest</MenuItem>
                  <MenuItem value='Recently Edited'>Recently Edited</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <hr></hr>
          {searchedAndSortedArticles.length > 0 ? (
            <ul>
              {searchedAndSortedArticles.map((article: Article) => (
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
        </div>
      );
    }

    return (
      <div className='community-content'>
        <div className='header-container'>
          <h2 style={{ marginBottom: '0' }}>Community Polls</h2>
          {canEdit && (
            <button className='create-poll-button' onClick={handleCreatePollClick}>
              <PiNotePencil style={{ marginRight: '5px' }} /> Create Poll
            </button>
          )}
        </div>
        <hr />
        {polls.length > 0 ? (
          <ul>
            {polls.map((poll: Poll) => (
              <li key={poll._id} className='poll-item' onClick={() => handlePollClick(poll._id!)}>
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

  return isCreatingArticle ? (
    <>
      <CommunityBreadcrumb communityID={communityID} subPageType={'New Article'} />
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
    </>
  ) : (
    <div className='community-page'>
      <div className='community-title'>
        <CommunityBreadcrumb
          communityID={communityID}
          subPageType={'Community'}
          styleOverride={{ paddingLeft: '0' }}
        />
        <div>
          <h5>Community:</h5>
          <h1>{titleText}</h1>
        </div>
      </div>

      <div className='tab-bar'>
        <div
          className='nav-tab'
          id={currentTab === 'Questions' ? 'active' : ''}
          onClick={() => setCurrentTab('Questions')}>
          Questions
        </div>
        <div
          className='nav-tab'
          id={currentTab === 'Articles' ? 'active' : ''}
          onClick={() => setCurrentTab('Articles')}>
          Articles
        </div>
        <div
          className='nav-tab'
          id={currentTab === 'Polls' ? 'active' : ''}
          onClick={() => setCurrentTab('Polls')}>
          Polls
        </div>
      </div>

      {renderContentType()}
    </div>
  );
};

export default CommunityPage;
