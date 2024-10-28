import React, { useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import { PollOption, PollProps } from '../../../types';
import { getMetaData } from '../../../tool';
import './index.css';
import PollVoting from './pollVoting';

type OptionState = PollOption | undefined;

/**
 * Poll component that allows users to vote on a poll and see its results.
 * The Poll component will only show the voting options when a user has not voted yet.
 * After submitting a vote, the user will see a bar chart that represents the results of the poll.
 */
const PollComponent = ({ poll }: PollProps) => {
  const { user } = useUserContext();
  const [voted, setVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(undefined as OptionState);

  return (
    <div className='pollContainer'>
      <div className='pollContent'>
        <div className='pollTitleSection'>
          <h2>{poll.title}</h2>
          <h5 className='greyText'>
            Created: {getMetaData(new Date(poll.pollDateTime))}, Ends:{' '}
            {getMetaData(new Date('December 17, 2024 12:00:00'))}
          </h5>
        </div>
        {!voted ? (
          <PollVoting updateVoteStatus={setVoted} updateVotedOption={setVotedOption} poll={poll} />
        ) : (
          <h1>{votedOption ? votedOption.text : 'no option selected'}</h1>
        )}
      </div>
    </div>
  );
};

export default PollComponent;
