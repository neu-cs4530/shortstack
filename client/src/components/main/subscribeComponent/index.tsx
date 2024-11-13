import { subscribeToQuestion } from '../../../services/questionService';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Question } from '../../../types';
import useSubscribedStatus from '../../../hooks/useSubscribedStatus';

/**
 * Interface represents the props for the SubscribeComponent.
 *
 * question - The question object containing subscriber information.
 */
interface SubscribeComponentProps {
  question: Question;
}

/**
 * A Subscribe component that allows users to subscribe to a question.
 *
 * @param question - The question object containing subscribed user information.
 */
const SubscribeComponent = ({ question }: SubscribeComponentProps) => {
  const { user } = useUserContext();
  const { subscribed } = useSubscribedStatus({ question });

  /**
   * Function to handle subscribing to a question.
   */
  const handleSubscribe = async () => {
    try {
      if (question._id) {
        await subscribeToQuestion(question._id, user.username);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error subscribing to question:', error);
    }
  };

  return (
    <div className='subscribe-container'>
      <button
        className={`subscribe-button ${subscribed ? 'subscribe-button-subscribed' : ''}`}
        onClick={() => handleSubscribe()}>
        {subscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  );
};

export default SubscribeComponent;
