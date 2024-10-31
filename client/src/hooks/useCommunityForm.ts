import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Community } from '../types';
import { addCommunity } from '../services/communityService';

/**
 * Custom hook for managing the state and logic of an community creation form.
 *
 * @returns name - the current name input for the community.
 * @returns textErr - the error message related to the text input.
 * @returns setName - the function to update the name text input.
 * @returns createCommunity - the function to create the community after submission.
 */
const useCommunityForm = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [nameErr, setNameErr] = useState<string>('');

  /**
   * Function to validate the form before submitting the new community.
   * @returns boolean - True if the form is valid, false if not.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!name) {
      isValid = false;
    } else if (name.length > 100) {
      setNameErr('Name cannot be more than 100 characters');
      isValid = false;
    } else {
      setNameErr('');
    }

    return isValid;
  };

  /**
   * Function to create a community
   * It validates the answer text and posts the answer if it is valid.
   */
  const createCommunity = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const community: Community = {
      name,
      members: [],
      questions: [],
      polls: [],
      articles: [],
    };

    const res = await addCommunity(community);

    if (res && res._id) {
      // navigate to the community that was created
      navigate(`/community/${res._id}`);
    }
  };

  return {
    name,
    setName,
    createCommunity,
    nameErr,
  };
};

export default useCommunityForm;
