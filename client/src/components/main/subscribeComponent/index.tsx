import './index.css';
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
  const { subscribed, handleSubscribe } = useSubscribedStatus({ question });

  return (
    <div className='subscribe-container'>
      <button
        className={`subscribe-button ${subscribed ? 'subscribe-button-subscribed' : ''}`}
        onClick={() => handleSubscribe()}>
        Subscribe{subscribed ? 'd' : ''}
      </button>
    </div>
  );
};

export default SubscribeComponent;
