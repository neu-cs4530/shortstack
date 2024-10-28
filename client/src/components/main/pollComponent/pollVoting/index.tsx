import { ChangeEventHandler, useState } from 'react';
import { PollOption, PollProps } from '../../../../types';
import './index.css';

type OptionState = PollOption | undefined;

/**
 * Poll component that allows users to vote on a poll and see its results.
 * The Poll component will only show the voting options when a user has not voted yet.
 * After submitting a vote, the user will see a bar chart that represents the results of the poll.
 */
const PollVoting = ({ poll, updateVoteStatus, updateVotedOption }: PollProps) => {
  const [selectedOption, setSelectedOption] = useState(undefined as OptionState);

  const voteButtonClick = () => {
    if (updateVoteStatus && updateVotedOption && selectedOption) {
      updateVoteStatus(true);
      updateVotedOption(selectedOption);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onOptionChange = (event: { target: { value: any } }) => {
    const selectedIndex = event.target.value;
    const chosenOption = poll.options.at(selectedIndex);
    setSelectedOption(chosenOption);
  };

  return (
    <div className='pollVotingContainer'>
      <div className='votingOptionsContainer'>
        {poll.options.map((opt, idx) => (
          <div className='optionContainer' key={idx}>
            <input
              type='radio'
              value={idx}
              name='pollOption'
              checked={selectedOption === opt}
              onChange={onOptionChange}
            />
            <label>{opt.text}</label>
          </div>
        ))}
      </div>
      <button id='voteButton' onClick={voteButtonClick}>
        Vote
      </button>
    </div>
  );
};

export default PollVoting;
