import React from 'react';
import { useNavigate } from 'react-router-dom';
import './communityList.css';
import MOCK_COMMUNITIES from './mockCommunityData';

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

  // TODO: Fetch the real joined communities
  const joinedCommunitiesID = ['1'];

  const joinedCommunities = MOCK_COMMUNITIES.filter(community =>
    joinedCommunitiesID.includes(community._id),
  );

  const availableCommunities = MOCK_COMMUNITIES.filter(
    community => !joinedCommunitiesID.includes(community._id),
  );

  return (
    <div className='community-list'>
      <h1>Communities</h1>

      <button className='create-button' onClick={handleCreateCommunity}>
        Create Community
      </button>

      <h2>Joined Communities</h2>
      {joinedCommunities.length > 0 ? (
        <ul>
          {joinedCommunities.map(community => (
            <li key={community._id} className='community-item'>
              <span className='community-name' onClick={() => handleCommunityClick(community._id)}>
                {community.name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No joined communities.</p>
      )}

      <h2>Available Communities</h2>
      {availableCommunities.length > 0 ? (
        <ul>
          {availableCommunities.map(community => (
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
      ) : (
        <p>No communities to join.</p>
      )}
    </div>
  );
};

export default CommunityList;
