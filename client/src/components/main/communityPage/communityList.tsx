import React from 'react';
import { useNavigate } from 'react-router-dom';
import './communityList.css';
import mockCommunity from './mockCommunityData';

/**
 * Represents the community list component. Displays the list of communities.
 */
const CommunityList = () => {
  const navigate = useNavigate();

  const handleCommunityClick = (communityID: string) => {
    navigate(`/community/${communityID}`);
  };

  // TODO : Implement the create community functionality
  const handleCreateCommunity = () => {
    navigate('/community/create');
  };

  return (
    <div className='community-list'>
      <h1>Communities</h1>

      <button className='create-button' onClick={handleCreateCommunity}>
        Create Community
      </button>

      <ul>
        {mockCommunity.map(community => (
          <li key={community._id} className='community-item'>
            <span className='community-name' onClick={() => handleCommunityClick(community._id)}>
              {community.name}
            </span>
            <button className='join-button' onClick={() => handleCommunityClick(community._id)}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityList;
