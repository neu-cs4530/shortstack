import React, { useEffect, useState } from 'react';
import './communityArticlePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Article } from '../../../../../types';
import getArticleById from '../../../../../services/articleService';

/**
 * The CommunityArticlePage component displays the articles within the community.
 */
const CommunityArticlePage = () => {
  const artID = useParams<{ articleID: string }>().articleID;
  const navigate = useNavigate();

  const [articleID, setArticleID] = useState<string>(artID || '');
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!artID) {
      navigate('/community');
      return;
    }

    setArticleID(artID);
  }, [artID, navigate]);

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      try {
        const res = await getArticleById(articleID);
        setArticle(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching article:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [articleID]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className='community-article-page'>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
    </div>
  );
};

export default CommunityArticlePage;
