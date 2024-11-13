import useUserContext from '../../../hooks/useUserContext';
import { markAllNotifsAsRead } from '../../../services/userService';
import './index.css';
import NotificationView from './notification';

/**
 * NotificationPage component that displays a user's notifications.
 */
const NotificationPage = () => {
  const { user } = useUserContext();

  /**
   * Function that sets the status of all notifications for the logged in user to read.
   */
  const handleReadAll = async () => {
    // res should be the array of notifications with their status updated.
    if (user) {
      await markAllNotifsAsRead(user.username);
    }
  };

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
