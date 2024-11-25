import { NotificationType } from '../../../../../types';
import './index.css';
import useNotificationSetting from '../../../../../hooks/useNotificationSetting';

/**
 * SettingView component that displays a single notification type's setting controls.
 */
const SettingView = ({ notificationType }: { notificationType: NotificationType }) => {
  const { isOn, handleCheckboxChange, notifSettingText } = useNotificationSetting({
    notificationType,
  });

  return (
    <div className='notification_type'>
      <label className='switch'>
        <input
          type='checkbox'
          checked={isOn}
          onChange={e => {
            handleCheckboxChange(e.target.checked);
          }}></input>
        <span className='slider'></span>
      </label>
      <div className='notification_desc'>{notifSettingText(notificationType)}</div>
    </div>
  );
};

export default SettingView;
