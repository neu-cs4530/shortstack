import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateHyperlink } from '../tool';
import addAnswer from '../services/answerService';
import useUserContext from './useUserContext';
import { Answer, Notification, NotificationType, Question } from '../types';
import { addPoints, notifyUsers } from '../services/userService';
import { incrementChallengeProgress } from '../services/challengeService';

/**
 * Custom hook for managing the state and logic of an answer submission form.
 *
 * @returns text - the current text input for the answer.
 * @returns textErr - the error message related to the text input.
 * @returns setText - the function to update the answer text input.
 * @returns postAnswer - the function to submit the answer after validation.
 */
const useAnswerForm = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [questionID, setQuestionID] = useState<string>('');

  useEffect(() => {
    if (!qid) {
      setTextErr('Question ID is missing.');
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  /**
   * Function to post an answer to a question.
   * It validates the answer text and posts the answer if it is valid.
   */
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr('Answer text cannot be empty');
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer: Answer = {
      text,
      ansBy: user.username,
      ansDateTime: new Date(),
      comments: [],
    };

    const res = await addAnswer(questionID, answer);

    if (res && res._id) {
      // add points to user
      addPoints(user.username, 20);
      // send notification to user(s) involved with the question
      const notif: Notification = {
        notificationType: NotificationType.Answer,
        sourceType: 'Question',
        source: { _id: questionID } as Question,
        isRead: false,
      };
      notifyUsers(questionID, notif);
      // add progress to any answer-related challenges
      try {
        await incrementChallengeProgress(user.username, 'answer');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error((error as Error).message);
      }
      // navigate to the question that was answered
      navigate(`/question/${questionID}`);
    }
  };

  return {
    text,
    textErr,
    setText,
    postAnswer,
  };
};

export default useAnswerForm;
