import { PollProps } from '../../../../types';
import './index.css';

/**
 * Poll component that allows users to vote on a poll and see its results.
 * The Poll component will only show the voting options when a user has not voted yet.
 * After submitting a vote, the user will see a bar chart that represents the results of the poll.
 */
const PollVoting = ({ poll, selectedOption, voteButtonClick, onOptionChange }: PollProps) => (
  <form className='pollVotingContainer' onSubmit={voteButtonClick}>
    <div className='votingOptionsContainer'>
      {poll?.options.map((opt, idx) => (
        <div className='optionContainer' key={idx}>
          <input
            type='radio'
            value={idx}
            name='pollOption'
            checked={selectedOption === opt}
            onChange={onOptionChange}
            required
          />
          <label>{opt.text}</label>
        </div>
      ))}
    </div>
    <button id='voteButton' type='submit'>
      Vote
    </button>
  </form>
);

export default PollVoting;
