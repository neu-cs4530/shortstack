import { useState } from 'react';
import { NotificationType } from '../../../../../types';
import './index.css';
import { updateBlockedNotifications } from '../../../../../services/userService';

/**
 * SettingView component that displays a single notification type's setting controls.
 */
const SettingView = ({
  notificationType,
  username,
  blockedNotifications,
}: {
  notificationType: NotificationType;
  username: string;
  blockedNotifications: NotificationType[];
}) => {
  // TODO: Toggle doesn't stay when you switch it and leave the page, may need a socket event...
  const [isOn, setIsOn] = useState<boolean>(!blockedNotifications.includes(notificationType));

  const handleCheckboxChange = async (isChecked: boolean) => {
    await updateBlockedNotifications(username, notificationType);
    setIsOn(isChecked); // Update state based on the checkbox state
  };

  /**
   * Function that determines the text displayed for a notification type setting
   * @param notifType - The type of notification setting that needs to be displayed
   * @returns the string that contains the notification setting's text.
   */
  const notifSettingText = (notifType: NotificationType): string => {
    let text = '';
    switch (notifType) {
      case 'Answer':
        text = 'New answers to your questions and subscribed questions.';
        break;
      case 'Comment':
        text = 'Comments on your questions.';
        break;
      case 'AnswerComment':
        text = 'Comments on your answers.';
        break;
      case 'Upvote':
        text = 'Upvotes on your questions.';
        break;
      case 'NewQuestion':
        text = 'New questions posted in your community.';
        break;
      case 'NewPoll':
        text = 'New polls posted in your community.';
        break;
      case 'PollClosed':
        text = 'Polls that you participated in closing.';
        break;
      case 'NewArticle':
        text = 'New articles posted in your community.';
        break;
      case 'ArticleUpdate':
        text = 'Updates made to articles posted in your community.';
        break;
      default:
        text = 'Unlocking new profile frames or titles.';
    }
    return text;
  };

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
