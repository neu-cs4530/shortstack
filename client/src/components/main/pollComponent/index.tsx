import { PollProps } from '../../../types';
import { getMetaData } from '../../../tool';
import './index.css';
import PollVoting from './pollVoting';
import PollResults from './pollResults';
import usePoll from '../../../hooks/usePoll';

/**
 * Poll component that allows users to vote on a poll and see its results.
 * The Poll component will only show the voting options when a user has not voted yet.
 * After submitting a vote, the user will see a bar chart that represents the results of the poll.
 */
const PollComponent = ({ poll }: PollProps) => {
  const { voted, selectedOption, voteButtonClick, onOptionChange } = usePoll(poll);

  return (
    <div className='pollContainer'>
      <div className='pollContent'>
        <div className='pollTitleSection'>
          <h2>{poll.title}</h2>
          <h5 className='greyText'>
            Created: {getMetaData(new Date('October 27, 2024 12:00:00'))}, Ends:{' '}
            {getMetaData(new Date('December 17, 2024 12:00:00'))}
          </h5>
        </div>
        {!voted ? (
          <PollVoting
            selectedOption={selectedOption}
            voteButtonClick={voteButtonClick}
            onOptionChange={onOptionChange}
            poll={poll}
          />
        ) : (
          <PollResults poll={poll}></PollResults>
        )}
      </div>
    </div>
  );
};

export default PollComponent;
