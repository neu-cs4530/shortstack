import './communityList.css';
import useCommunityList from '../../../hooks/useCommunityList';

/**
 * Represents the community list component. Displays the list of communities.
 */
const CommunityList = () => {
  const {
    joinedCommunities,
    availableCommunities,
    handleCommunityClick,
    handleCreateCommunity,
    handleJoinCommunity,
  } = useCommunityList();

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
              <span className='community-name' onClick={() => handleCommunityClick(community._id!)}>
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
              <span className='community-name' onClick={() => handleCommunityClick(community._id!)}>
                {community.name}
              </span>
              <button className='join-button' onClick={() => handleJoinCommunity(community._id!)}>
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
