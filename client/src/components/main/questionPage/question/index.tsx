import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';
import ProfilePicture from '../../profilePicture/profilePicture';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <div
      className='question right_padding'
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      <div className='postStats'>
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views.length} views</div>
      </div>
      <div className='question_mid'>
        <div className='postTitle'>{q.title}</div>
        <div className='question_tags'>
          {q.tags.map((tag, idx) => (
            <button
              key={idx}
              className='question_tag_button'
              onClick={e => {
                e.stopPropagation();
                if (tag && tag.name) {
                  clickTag(tag.name);
                }
              }}>
              {tag?.name || 'Unnamed Tag'}
            </button>
          ))}
        </div>
      </div>
      <div className='lastActivity small-profile'>
        {/* TODO : get user info somewhere and then change the equippedFrame field to the users equipped frame */}
        <ProfilePicture user={{ username: q.askedBy, equippedFrame: q.askedBy }} />
        <div>&nbsp;</div>
        <div className='question_meta'>asked {getMetaData(new Date(q.askDateTime))}</div>
      </div>
    </div>
  );
};

export default QuestionView;
