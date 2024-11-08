import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../../../../../types';
import './communityArticlePage.css';
import useCommunityPage from '../../../../../hooks/useCommunityPage';

/**
 * The CommunityArticlePage component displays the articles within the community.
 */
const CommunityArticlePage = () => {
  const { articles } = useCommunityPage();
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (articleId) {
      const foundArticle = articles.find(a => a._id === articleId);
      setArticle(foundArticle || null);
    }
  }, [articleId, articles]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className='community-article-page'>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
    </div>
  );
};

export default CommunityArticlePage;
