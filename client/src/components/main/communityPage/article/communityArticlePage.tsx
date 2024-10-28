import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../../../../types';
import './communityArticlePage.css';
// Mock data
import mockCommunity from '../mockCommunityData';

const CommunityArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (articleId) {
      // Using mock data for now
      const foundArticle = mockCommunity.articles.find(a => a._id === articleId);
      setArticle(foundArticle || null);
    }
  }, [articleId]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className='community-article-page'>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
    </div>
  );
};

export default CommunityArticlePage;
