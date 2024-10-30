import usePoll from '../../../../hooks/usePoll';
import { PollProps } from '../../../../types';
import './index.css';

/**
 * PollResults component that shows users the total amount of votes each poll option has.
 * The PollResults component will only show up if a user has already voted.
 * The component will also visually indicate which option the logged in user voted on.
 */
const PollResults = ({ poll }: PollProps) => {
  const { optionUserVotedFor, findBarChartWidth } = usePoll(poll);

  return (
    <div className='poll_results_container'>
      {poll.options.map((opt, idx) => (
        <div
          className={
            optionUserVotedFor === opt ? 'option_results is_voted_option' : 'option_results'
          }
          key={idx}>
          <h5 id='optText'>{opt.text}</h5>
          <div className='results_bar' style={{ width: findBarChartWidth(opt.usersVoted.length) }}>
            {opt.usersVoted.length}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PollResults;
