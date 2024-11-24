import PollVoting from './pollVoting';
import PollResults from './pollResults';
import usePoll from '../../../hooks/usePoll';
import { getMetaData } from '../../../tool';
import './index.css';
import CommunityBreadcrumb from '../communityPage/community/breadcrumb/communityBreadcrumb';
import ProfilePicture from '../profilePicture';

/**
 * PollPage component that displays the poll title and the PollVoting or PollResults component.
 * The PollPage component will only show the PollVoting component if the user has not voted yet
 * and if the poll is still open.
 * After submitting a vote, the user will see the PollResults component.
 * When the poll closes, the user will see the PollResults component.
 */
const PollPage = () => {
  const { poll, pollIsClosed, voted, selectedOption, voteButtonClick, onOptionChange } = usePoll();

  return (
    poll && (
      <>
        <CommunityBreadcrumb
          objectID={poll?._id}
          subPageType='Poll'
          currentPageTitle={poll?.title}
        />
        <div className='pollContainer'>
          <div className='pollContent'>
            <div className='pollTitleSection'>
              <h2>{poll?.title}</h2>
              <div className='createdByText'>
                <div className='profile-pic-container'>
                  <ProfilePicture username={poll.createdBy} />
                </div>
                <h5>Created by:</h5>
                <h5 className='usernameText'>{poll.createdBy}</h5>
              </div>
              <h5 className='greyText'>
                Created on: {getMetaData(new Date(poll.pollDateTime))}, End{pollIsClosed ? 'ed' : 's'}:{' '}
                {getMetaData(new Date(poll.pollDueDate))}
              </h5>
            </div>
            {!voted && !pollIsClosed ? (
              <PollVoting
                selectedOption={selectedOption}
                voteButtonClick={voteButtonClick}
                onOptionChange={onOptionChange}
                poll={poll}
              />
            ) : (
              <PollResults poll={poll} />
            )}
          </div>
        </div>
      </>
    )
  );
};

export default PollPage;
