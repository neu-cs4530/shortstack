import { useEffect, useState } from 'react';
import { getCommunityDetails } from '../services/communityService';
import { Community } from '../types';

/**
 * Custom hook to fetch and manage community details by ID.
 *
 * @param communityId - The ID of the community to fetch details for.
 * @returns The community details or `null` if not available.
 */
const useCommunityDetails = (communityId?: string) => {
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    // If communityId is not defined, skip fetching
    if (!communityId) {
      setCommunity(null);
      return;
    }

    const fetchCommunity = async () => {
      try {
        const data = await getCommunityDetails(communityId);
        setCommunity(data);
      } catch (error) {
        console.error(`Failed to fetch details for community ID: ${communityId}`, error);
      }
    };

    fetchCommunity();
  }, [communityId]);

  return community;
};

export default useCommunityDetails;
