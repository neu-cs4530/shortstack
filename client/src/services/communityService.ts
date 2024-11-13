import { Article, Community, CommunityObjectType } from '../types';
import api from './config';

const COMMUNITY_API_URL = `${process.env.REACT_APP_SERVER_URL}/community`;

/**
 * Function to get details of a community by its ID.
 *
 * @param communityId - The ID of the community to retrieve.
 * @throws Error if there is an issue fetching the community details.
 */
const getCommunityDetails = async (communityId: string): Promise<Community> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityById/${communityId}`);
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
  const data = { community };
  const res = await api.post(`${COMMUNITY_API_URL}/addCommunity`, data);

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
    const res = await api.get(`${COMMUNITY_API_URL}/getCommunity`);
    return res.data;
  } catch (error) {
    throw new Error('Error fetching communities');
  }
};

/**
 * Function to add a question to a community.
 *
 * @param communityId - The ID of the community to add the question to.
 * @param questionId - The ID of the question to add to the community.
 * @throws Error if there is an issue adding the question to the community.
 */
const addQuestionToCommunity = async (communityId: string, questionId: string) => {
  const data = { questionId };
  const res = await api.put(`${COMMUNITY_API_URL}/addQuestionToCommunity/${communityId}`, data);
  if (res.status !== 200) {
    throw new Error('Error adding question to community');
  }
};

/**
 * Function to add a user to a community.
 *
 * @param userId - The ID of the user to add to the community.
 * @param communityID - The ID of the community.
 */
const joinCommunity = async (userId: string, communityID: string): Promise<void> => {
  const res = await api.put(`${COMMUNITY_API_URL}/joinCommunity/${communityID}/${userId}`);

  if (res.status !== 200) {
    throw new Error(res.data);
  }

  return res.data;
};

/**
 * Function to get members of the community that owns the object.
 *
 * @param oid - The ID of the object
 * @param objectType - The type of the object
 * @returns A list of usernames of the members of the community.
 */
const getCommunityMembersByObjectId = async (
  oid: string,
  objectType: CommunityObjectType,
): Promise<string[]> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getMembers/${oid}/${objectType}`);

  if (res.status !== 200) {
    throw new Error(res.data);
  }

  return res.data;
};

/**
 * Function to update the article with the given ID.
 *
 * @param articleID - The ID of the article to update
 * @param newArticle - The contents of the article to replace it with.
 * @returns The updated article
 * @throws Error if the operation failed.
 */
const addArticleToCommunity = async (communityId: string, article: Article): Promise<Article> => {
  const data = { article };
  const res = await api.post(`${COMMUNITY_API_URL}/addArticle/${communityId}`, data);
  if (res.status !== 200) {
    throw new Error('Error when adding article to community');
  }

  return res.data;
};

export {
  getCommunityDetails,
  addCommunity,
  getCommunities,
  addQuestionToCommunity,
  joinCommunity,
  getCommunityMembersByObjectId,
  addArticleToCommunity,
};
