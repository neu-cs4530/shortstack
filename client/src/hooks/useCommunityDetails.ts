import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunityByObjectId, getCommunityDetails } from '../services/communityService';
import { CommunityObjectType, CommunitySubpageType } from '../types';

/**
 * Hook for handling the logic for retrieving community details for a community object.
 * @param communityID - The ID of the community the user is navigating.
 * @param objectID - The ID of the object within a community that the user is viewing.
 * @param subPageType - The type of subpage the user is in within a community.
 * @returns handleNavigateToCommunity - Function that navigates the user to the community page of
 *                                      the community with the communityID
 * @returns handleNavigateToCommunityList - Function that navigates the user to the community list page
 * @returns communityTitle - The title of the community the user is in.
 */
const useCommunityDetails = ({
  communityID,
  objectID,
  subPageType,
}: {
  communityID?: string;
  objectID?: string;
  subPageType?: CommunitySubpageType;
}) => {
  const navigate = useNavigate();
  const [communityTitle, setCommunityTitle] = useState<string>('');
  const [fetchedCommuntiyId, setFetchedCommunityId] = useState<string>(communityID || '');

  useEffect(() => {
    const fetchCommunityTitle = async () => {
      if (communityID) {
        try {
          const community = await getCommunityDetails(communityID);
          setCommunityTitle(community.name);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('failed to fetch community by id');
        }
      } else if (objectID) {
        try {
          // if subPageType is 'Community', 'New Article', or 'New Poll', communityID should already be provided
          if (subPageType === 'Article' || subPageType === 'Poll' || subPageType === 'Question') {
            const community = await getCommunityByObjectId(
              objectID,
              subPageType as CommunityObjectType,
            );
            setCommunityTitle(community.name);
            setFetchedCommunityId(community._id!);
          }
        } catch (error) {
          setCommunityTitle('');
        }
      }
    };

    fetchCommunityTitle();
  }, [communityID, objectID, subPageType]);

  /**
   * Function to navigate to the community page of the community with communityID
   */
  const handleNavigateToCommunity = () => {
    navigate(`/community/${fetchedCommuntiyId}`);
  };

  /**
   * Function to navigate to the community list
   */
  const handleNavigateToCommunityList = () => {
    navigate(`/community`);
  };

  return {
    handleNavigateToCommunity,
    handleNavigateToCommunityList,
    communityTitle,
  };
};

export default useCommunityDetails;
