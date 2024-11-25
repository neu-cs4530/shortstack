import useEquippedRewards from '../../../../hooks/useEquippedRewards';
import { getMetaData } from '../../../../tool';
import { Comment } from '../../../../types';
import ProfilePicture from '../../profilePicture';

/**
 * Interface representing the props for the CommentView component.
 */
interface CommentProps {
  comment: Comment;
}

/**
 * Component that renders an individual comment, with the comment text and information about the person who
 * created the comment.
 * @param comment - The comment being displayed.
 */
const CommentView = ({ comment }: CommentProps) => {
  const { frame, title } = useEquippedRewards(comment.commentBy);

  return (
    <li className='comment-item'>
      <p className='comment-text'>{comment.text}</p>
      <div className='commentedBy'>
        <div className='profile-pic-container'>
          <ProfilePicture equippedFrame={frame || ''} />
        </div>
        <div className='commentedByText'>
          <small className='comment-meta'>
            {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
          </small>
          <small className='userTitleText'>{title}</small>
        </div>
      </div>
    </li>
  );
};

export default CommentView;
