import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Community } from '../types';
import { getCommunities, joinCommunity } from '../services/communityService';
import useUserContext from './useUserContext';

/**
 * Custom hook for fetching and managing a list of communities.
 */
const useCommunityList = () => {
  const { user, socket } = useUserContext();
  const navigate = useNavigate();
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([]);
  const [availableCommunities, setAvailableCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const allCommunities = await getCommunities();

        const joined = allCommunities.filter(community =>
          community.members.some(member => member._id === user?._id),
        );

        const available = allCommunities.filter(
          community => !community.members.some(member => member._id === user?._id),
        );

        setJoinedCommunities(joined);
        setAvailableCommunities(available);
      } catch (error) {
        throw new Error('Failed to fetch communities');
      }
    };

    if (user) {
      fetchCommunities();
    }
  }, [user]);

  useEffect(() => {
    /**
     * Function to handle updates to communities
     *
     * @param community - The community that was updated
     */
    const updateCommunities = (community: Community) => {
      // add the community to available communities if it's missing
      if (!availableCommunities.some(c => c._id === community._id)) {
        const available = [...availableCommunities, community];

        setAvailableCommunities(available);
      }

      // add the community to joined communities if it's missing and the current user is in the updated community
      if (
        !joinedCommunities.some(c => c._id === community._id) &&
        community.members.some(m => m._id === user._id)
      ) {
        const joined = [...joinedCommunities, community];

        setJoinedCommunities(joined);
      }
    };

    socket.on('communityUpdate', updateCommunities);

    return () => {
      socket.off('communityUpdate');
    };
  }, [socket, availableCommunities, joinedCommunities, user._id]);

  const handleCommunityClick = (communityID: string) => {
    navigate(`/community/${communityID}`);
  };

  const handleCreateCommunity = () => {
    navigate('/community/create');
  };

  const handleJoinCommunity = async (communityID: string) => {
    try {
      await joinCommunity(user._id!, communityID);
      handleCommunityClick(communityID);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(`Could not join community: ${(error as Error).message}`);
    }
  };

  return {
    joinedCommunities,
    availableCommunities,
    handleCommunityClick,
    handleCreateCommunity,
    handleJoinCommunity,
  };
};

export default useCommunityList;
