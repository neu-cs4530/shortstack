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
        console.log('Fetched communities hook:', allCommunities); // Debugging line

        const joined = [];
        for (const community of allCommunities) {
          console.log('Community:', community); // Debugging line
          console.log('User:', user); // Debugging line
          console.log('Members:', community.members); // Debugging line
          if (community.members.some(member => member._id === user?._id)) {
            joined.push(community);
          }
        }

        const available = allCommunities.filter(
          community => !community.members.some(member => member._id === user?._id),
        );

        setJoinedCommunities(joined);
        setAvailableCommunities(available);
      } catch (error) {
        console.error('Failed to fetch communities:', error); // Updated error message
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
