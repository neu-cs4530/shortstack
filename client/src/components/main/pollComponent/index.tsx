import PollVoting from './pollVoting';
import PollResults from './pollResults';
import usePoll from '../../../hooks/usePoll';
import { getMetaData } from '../../../tool';
import './index.css';

const PollPage = () => {
  const { poll, voted, selectedOption, voteButtonClick, onOptionChange } = usePoll();

  return (
    poll && (
      <div className='pollContainer'>
        <div className='pollContent'>
          <div className='pollTitleSection'>
            <h2>{poll?.title}</h2>
            <h5 className='greyText'>
              Created: {getMetaData(new Date(poll.pollDateTime))}, Ends:{' '}
              {getMetaData(new Date(poll.pollDueDate))}
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
    )
  );
};

export default PollPage;
