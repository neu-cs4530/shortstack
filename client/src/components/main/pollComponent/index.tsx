import React, { useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import { Poll } from '../../../types';

/**
 * Poll component that allows users to vote on a poll and see its results.
 * The Poll component will only show the voting options when a user has not voted yet.
 * After submitting a vote, the user will see a bar chart that represents the results of the poll.
 */
const PollComponent = (poll: Poll) => {
  const { user } = useUserContext();
  const [voted, setVoted] = useState(false);
};

export default PollComponent;
