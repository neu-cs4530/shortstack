import useUserContext from '../../../hooks/useUserContext';
import './index.css';
import NotificationView from './notification';

/**
 * NotificationPage component that displays a user's notifications.
 */
const NotificationPage = () => {
  const handleReadAll = () => {};

  const { user } = useUserContext();

  return (
    <div>
      <div className='space_between right_padding'>
        <div className='bold_title'>Notifications</div>
        <button
          className='bluebtn'
          onClick={() => {
            handleReadAll();
          }}>
          Mark All as Read
        </button>
      </div>
      <div className='notification_list'>
        {user.notifications.map((notification, idx) => (
          <NotificationView notif={notification} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
