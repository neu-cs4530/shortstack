import { ChangeEvent, useState } from 'react';
import { Poll, PollOption } from '../types';

const usePoll = (poll: Poll) => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PollOption | undefined>(undefined);

  /**
   * Function that handles the user hitting the vote button and submitting their vote.
   */
  const voteButtonClick = () => {
    setVoted(true);
  };

  /**
   * Function that handles the user changing the selected radio button
   * @param event - the event triggered from the input element
   */
  const onOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedIndex = event.target.value;
    const chosenOption = poll.options.at(parseInt(selectedIndex, 10));
    setSelectedOption(chosenOption);
  };

  return {
    voted,
    setVoted,
    selectedOption,
    voteButtonClick,
    onOptionChange,
  };
};

export default usePoll;
