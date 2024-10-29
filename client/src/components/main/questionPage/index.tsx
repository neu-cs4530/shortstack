import React from 'react';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import PollComponent from '../pollComponent';
import { Poll, PollOption, User } from '../../../types';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  // DELETE LATER: example poll, poll options, and user for UI testing.
  const testUser: User = {
    username: 'vanessa',
  };

  const opt1: PollOption = {
    text: 'Option 1 adf,ksjdhf,kasdhf',
    usersVoted: ['v', 'a', 'n', 'e', 's', 's', 'a'],
  };

  const opt2: PollOption = {
    text: 'Option 2',
    usersVoted: ['vanessa', 'a', 'n'],
  };

  const opt3: PollOption = {
    text: 'Option 3',
    usersVoted: ['v', 'a', 'n', 'e', 's'],
  };

  const testPoll: Poll = {
    title: 'This is a poll',
    options: [opt1, opt2, opt3],
    createdBy: testUser,
    pollDateTime: new Date(),
    pollDueDate: new Date(),
  };

  return (
    <>
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />
      <PollComponent poll={testPoll} />
      <div id='question_list' className='question_list'>
        {qlist.map((q, idx) => (
          <QuestionView q={q} key={idx} />
        ))}
      </div>
      {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
