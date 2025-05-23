import React from 'react';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Comment } from '../../../../types';
import ProfilePicture from '../../profilePicture';
import useEquippedRewards from '../../../../hooks/useEquippedRewards';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, handleAddComment }: AnswerProps) => {
  const { frame, title } = useEquippedRewards(ansBy);
  return (
    <div className='answer right_padding'>
      <div id='answerText' className='answerText'>
        {handleHyperlink(text)}
      </div>
      <div className='answerAuthor'>
        <div className='answeredByText'>
          <div className='answer_author'>{ansBy}</div>
          <h5 className='userTitleText'>{title}</h5>
          <div className='answer_question_meta'>{meta}</div>
        </div>
        <div className='profile-pic-container'>
          <ProfilePicture equippedFrame={frame || ''} />
        </div>
      </div>
      <CommentSection comments={comments} handleAddComment={handleAddComment} />
    </div>
  );
};

export default AnswerView;
