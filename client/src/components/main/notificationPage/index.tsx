import { VscSettingsGear } from 'react-icons/vsc';
import useNotificationPage from '../../../hooks/useNotificationPage';
import './index.css';
import NotificationView from './notification';

/**
 * NotificationPage component that displays a user's notifications.
 */
const NotificationPage = () => {
  const { notifications, handleReadAll, handleNotificationSettings } = useNotificationPage();

  return (
    <div>
      <div className='space_between right_padding'>
        <div className='notification_controls'>
          <button
            className='settings_button'
            onClick={() => {
              handleNotificationSettings();
            }}>
            {<VscSettingsGear size='24px' />}
          </button>
          <div className='bold_title'>Notifications</div>
        </div>
        <button
          className='bluebtn'
          onClick={() => {
            handleReadAll();
          }}>
          Mark All as Read
        </button>
      </div>
      <div className='notification_list'>
        {notifications.map((notification, idx) => (
          <NotificationView notif={notification} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
