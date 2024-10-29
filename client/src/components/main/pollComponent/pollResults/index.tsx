import { PollProps } from '../../../../types';
import './index.css';

/**
 * PollResults component that shows users the total amount of votes each poll option has.
 * The PollResults component will only show up if a user has already voted.
 * The component will also visually indicate which option the logged in user voted on.
 */
const PollResults = ({ poll }: PollProps) => {
  // The poll option that the logged in user voted for (PLACEHOLDER FOR TESTING)
  const optionUserVotedFor = poll.options.filter(opt => opt.usersVoted.includes('vanessa')).at(0);

  /**
   * Function that finds the width of the bar chart for an option based on its number of votes
   * @param numVoted - the number of votes for a poll option
   * @returns - a string that dictates the style width of the option's bar chart bar.
   */
  const findBarChartWidth = (numVoted: number): string => {
    const pollOptionVotes: number[] = poll.options.map(opt => opt.usersVoted.length);
    const mostVotedAmount = pollOptionVotes.sort((a, b) => b - a).at(0);
    if (mostVotedAmount) {
      const calculatedWidth = numVoted === mostVotedAmount ? 80 : (numVoted / mostVotedAmount) * 80;
      const percentageWidth = Math.round(calculatedWidth);
      return `${percentageWidth}%`;
    }
    return '';
  };

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
