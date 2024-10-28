import './index.css';

/**
 * NotificationPage component that displays a user's notifications.
 */
const NotificationPage = () => {
  // To be implemented in sprint 2
  const handleReadAll = () => {};

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
    </div>
  );
};

export default NotificationPage;
