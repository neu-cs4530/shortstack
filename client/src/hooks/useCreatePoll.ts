import { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addPollToCommunity } from '../services/communityService';
import { Poll } from '../types';
import useUserContext from './useUserContext';

const useCreatePoll = () => {
  const { user, socket } = useUserContext();
  const { communityID } = useParams<{ communityID: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null); // State for the current poll

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!communityID) {
      setError('Community ID is missing.');
      return;
    }

    if (!title || !dueDate || options.length < 2 || options.some(opt => !opt)) {
      setError('Please fill in all fields and add at least two options.');
      return;
    }

    const localDate = new Date(`${dueDate}T00:00:00`);
    const timezoneOffset = localDate.getTimezoneOffset();
    const utcDate = new Date(localDate.getTime() + timezoneOffset * 60000);

    const newPoll: Poll = {
      title,
      options: options.map(option => ({ text: option, usersVoted: [] })),
      createdBy: user.username,
      pollDateTime: new Date(),
      pollDueDate: utcDate,
      isClosed: false,
    };

    try {
      await addPollToCommunity(communityID, newPoll);
      navigate(`/community/${communityID}`);
    } catch (e) {
      setError('Failed to create poll. Please try again.');
    }
  };

  useEffect(() => {
    /**
     * Function to update the poll if a pollUpdate socket event is received.
     * @param updatedPoll - The updated poll from the socket event
     */
    const updatePoll = (updatedPoll: Poll) => {
      if (updatedPoll._id === poll?._id) {
        setPoll(updatedPoll);
      }
    };

    socket.on('pollUpdate', updatePoll);

    return () => {
      socket.off('pollUpdate', updatePoll);
    };
  }, [socket, poll]);

  return {
    title,
    dueDate,
    options,
    error,
    communityID,
    setError,
    handleTitleChange,
    handleDueDateChange,
    handleOptionChange,
    handleAddOption,
    handleSubmit,
  };
};

export default useCreatePoll;
