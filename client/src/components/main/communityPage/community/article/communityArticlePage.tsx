import './communityArticlePage.css';
import { FaPencilAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import useCommunityArticle from '../../../../../hooks/useCommunityArticle';
import CommunityArticleForm from './communityArticleForm';
import { Article } from '../../../../../types';
import CommunityBreadcrumb from '../breadcrumb/communityBreadcrumb';
import { getMetaData } from '../../../../../tool';

/**
 * The CommunityArticlePage component displays the articles within the community.
 */
const CommunityArticlePage = () => {
  const { article, isEditing, canEdit, toggleEditMode, setArticle } = useCommunityArticle();

  if (!article) return <div>Loading...</div>;

  const renderContent = () =>
    isEditing ? (
      <CommunityArticleForm
        title={article.title}
        body={article.body}
        articleId={article._id}
        toggleEditMode={toggleEditMode}
        submitCallback={(newArticle: Article) => {
          setArticle(newArticle);
          toggleEditMode();
        }}
      />
    ) : (
      <>
        {canEdit && (
          <button className='edit-button' onClick={toggleEditMode}>
            {<FaPencilAlt style={{ marginRight: '10px' }} />}Edit
          </button>
        )}
        <h2 id='articleTitle'>{article.title}</h2>
        <h5 className='metadata-label'>Created: {getMetaData(new Date(article.createdDate!))}</h5>
        <h5 className='metadata-label'>
          Last Edited: {getMetaData(new Date(article.latestEditDate!))}
        </h5>
        <span style={{ marginTop: '8px', borderBottom: '2px solid #007bff' }} />
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </>
    );

  return (
    <>
      <CommunityBreadcrumb
        objectID={article._id}
        subPageType={article.title ? 'Article' : 'New Article'}
        currentPageTitle={article.title}
      />
      <div className='community-article-page'>{renderContent()}</div>
    </>
  );
};

export default CommunityArticlePage;
