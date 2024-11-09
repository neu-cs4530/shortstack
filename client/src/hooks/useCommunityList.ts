import { useEffect, useState } from 'react';
import { Community } from '../types';
import { getCommunities } from '../services/communityService';
import useUserContext from './useUserContext';

/**
 * Custom hook for fetching and managing a list of communities.
 */
const useCommunityList = () => {
  const { user } = useUserContext();
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

  return { joinedCommunities, availableCommunities };
};

export default useCommunityList;
