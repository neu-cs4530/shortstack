import './communityArticleForm.css';
import useArticleForm from '../../../../../hooks/useArticleForm';
import { Article } from '../../../../../types';

/**
 * Component for the input form for an article.
 * @param title - The initial title of the article
 * @param body - The initial body of the article
 */
const CommunityArticleForm = ({
  title,
  body,
  communityId,
  articleId,
  toggleEditMode,
  submitCallback,
}: {
  title?: string;
  body?: string;
  communityId?: string;
  articleId?: string;
  toggleEditMode: () => void;
  submitCallback: (newArticle: Article) => void;
}) => {
  const {
    articleTitleInput,
    articleBodyInput,
    handleArticleTitleInputChange,
    handleArticleSubmit,
  } = useArticleForm({ communityId, title, body, articleId, submitCallback });

  return (
    <form className='article-form' onSubmit={handleArticleSubmit} onReset={toggleEditMode}>
      <div className='buttons'>
        <button type='reset' className='cancel-button'>
          Cancel
        </button>
        <button type='submit' className='save-button'>
          Save
        </button>
      </div>
      <input
        type='text'
        placeholder='Please enter title'
        required
        value={articleTitleInput}
        onChange={handleArticleTitleInputChange}
        className='title-input'
        id={'articleTitleInput'}
        maxLength={100}
      />
      <textarea
        placeholder='Please enter body'
        required
        className='body-input'
        id={'articleBodyInputElement'}
        rows={25}
        defaultValue={articleBodyInput}
      />
    </form>
  );
};

export default CommunityArticleForm;
