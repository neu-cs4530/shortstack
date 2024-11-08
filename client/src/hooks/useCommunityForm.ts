import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Community } from '../types';
import { addCommunity } from '../services/communityService';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the state and logic of an community creation form.
 *
 * @returns name - the current name input for the community.
 * @returns setName - the function to update the name text input.
 * @returns createCommunity - the function to create the community after submission.
 * @returns nameErr - the error message related to the name text input.
 */
const useCommunityForm = () => {
  const navigate = useNavigate();

  const { user } = useUserContext();
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
   * It validates the community name's text and posts the community if it is valid.
   */
  const createCommunity = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    if (!user._id) {
      return;
    }

    const newCommunity: Community = {
      name,
      members: [],
      questions: [],
      polls: [],
      articles: [],
    };

    const res = await addCommunity(user._id, newCommunity);

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
