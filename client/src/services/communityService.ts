import { Community } from '../types';
import api from './config';

const COMMUNITY_API_URL = `${process.env.REACT_APP_SERVER_URL}/community`;

/**
 * Function to get details of a community by its ID.
 *
 * @param communityId - The ID of the community to retrieve.
 * @throws Error if there is an issue fetching the community details.
 */
const getCommunityDetails = async (communityId: string): Promise<Community> => {
  const res = await api.get(`${COMMUNITY_API_URL}/${communityId}`);
  if (res.status !== 200) {
    throw new Error('Error fetching community details');
  }
  return res.data;
};

/**
 * Function to add a new community.
 *
 * @param community - The community object to add.
 * @throws Error if there is an issue creating the new community.
 */
const addCommunity = async (community: Community): Promise<Community> => {
  const res = await api.post(`${COMMUNITY_API_URL}/add`, community);
  if (res.status !== 200) {
    throw new Error('Error while creating a new community');
  }
  return res.data;
};

/**
 * Function to get the list of communities.
 *
 * @throws Error if there is an issue fetching the communities.
 */
const getCommunities = async (): Promise<Community[]> => {
  try {
    const res = await api.get(`${COMMUNITY_API_URL}/communities`);
    return res.data;
  } catch (error) {
    throw new Error('Error fetching communities');
  }
};

export { getCommunityDetails, addCommunity, getCommunities };
