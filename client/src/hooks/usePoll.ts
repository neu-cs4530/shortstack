import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Poll, PollOption, PollVoteData } from '../types';
import useUserContext from './useUserContext';
import { getPollById, voteOnPoll } from '../services/pollService';

/**
 * Custom hook for managing the state and logic of a poll.
 *
 * @returns voted - the boolean indicating whether the user has voted on the poll.
 * @returns setVoted - the function to update the poll's voted state.
 * @returns selectedOption - the PollOption the user currently has selected while voted.
 * @returns voteButtonClick - the function to handle a user submitting a vote.
 * @returns onOptionChange - the function to handle a user changing the selected poll option.
 * @returns optionUserVotedFor - the function that handles finding the option the user voted for.
 * @returns barChartWidth - the function that calculates an option's bar chart size based on number of votes.
 */
const usePoll = () => {
  const { pollID } = useParams();
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PollOption | undefined>(undefined);
  const [poll, setPoll] = useState<Poll | undefined>(undefined);
  const { user, socket } = useUserContext();

  useEffect(() => {
    const fetchPoll = async (id: string) => {
      try {
        const fetchedPoll = await getPollById(id);
        setPoll(fetchedPoll);
        const hasVoted = fetchedPoll.options.some((opt: PollOption) =>
          opt.usersVoted.includes(user.username),
        );
        setVoted(hasVoted);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    if (pollID) {
      fetchPoll(pollID);
    }
  }, [pollID, user.username]);

  // Finding the option that the logged in user voted on for the poll.
  const optionUserVotedFor = poll?.options
    .filter(opt => opt.usersVoted.includes(user.username))
    .at(0);

  /**
   * Function that finds the width of the bar chart for an option based on its number of votes
   * @param numVoted - the number of votes for a poll option
   * @returns - a string that dictates the style width of the option's bar chart bar.
   */
  const barChartWidth = (numVoted: number): string => {
    if (!poll) {
      return '';
    }
    const pollOptionVotes: number[] = poll.options.map(opt => opt.usersVoted.length);
    const mostVotedAmount = pollOptionVotes.sort((a, b) => b - a).at(0);
    if (mostVotedAmount) {
      const calculatedWidth = numVoted === mostVotedAmount ? 80 : (numVoted / mostVotedAmount) * 80;
      const percentageWidth = Math.round(calculatedWidth);
      return `${percentageWidth}%`;
    }
    return '';
  };

  /**
   * Function that handles the user hitting the vote button and submitting their vote.
   *
   * @param event: The form event from submission.
   */
  const voteButtonClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOption || !poll) {
      // eslint-disable-next-line no-console
      console.error('No option selected or poll not loaded');
      return;
    }

    try {
      const pollVoteData: PollVoteData = {
        pollId: poll._id!,
        optionId: selectedOption._id!,
        username: user.username,
      };

      const updatedPoll = await voteOnPoll(pollVoteData);

      setPoll(updatedPoll);
      setVoted(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error voting on poll:', error);
    }
  };

  /**
   * Function that handles the user changing the selected radio button
   * @param event - the event triggered from the input element
   */
  const onOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedIndex = event.target.value;
    const chosenOption = poll?.options.at(parseInt(selectedIndex, 10));
    setSelectedOption(chosenOption);
  };

  useEffect(() => {
    const handlePollUpdate = (updatedPoll: Poll) => {
      if (poll && updatedPoll._id === poll._id) {
        setPoll(updatedPoll);
        const hasVoted = updatedPoll.options.some((opt: PollOption) =>
          opt.usersVoted.includes(user.username),
        );
        setVoted(hasVoted);
      }
    };

    socket.on('pollUpdate', handlePollUpdate);

    return () => {
      socket.off('pollUpdate', handlePollUpdate);
    };
  }, [poll, user.username, socket]);

  return {
    poll,
    voted,
    setVoted,
    selectedOption,
    voteButtonClick,
    onOptionChange,
    optionUserVotedFor,
    barChartWidth,
  };
};

export default usePoll;
