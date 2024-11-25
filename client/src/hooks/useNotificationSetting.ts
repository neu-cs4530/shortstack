import { useState } from 'react';
import useUserContext from './useUserContext';
import { NotificationType } from '../types';
import { updateBlockedNotifications } from '../services/userService';

/**
 * Hook for managing the logic for a notification setting component.
 * @param notificationType - The type of notification the component controls.
 * @returns isOn - whether the setting is toggled
 * @returns handleCheckboxChange - Function to toggle the setting.
 * @returns notifSettingText - Function to determine the text to be displayed for the setting
 */
const useNotificationSetting = ({ notificationType }: { notificationType: NotificationType }) => {
  const { user } = useUserContext();
  const [isOn, setIsOn] = useState<boolean>(
    !user.blockedNotifications.some(n => n === notificationType),
  );

  /**
   * Function to toggle the notification setting
   * @param isChecked - Whether the toggle is checked or not.
   */
  const handleCheckboxChange = async (isChecked: boolean) => {
    await updateBlockedNotifications(user.username, notificationType);
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

  return { isOn, handleCheckboxChange, notifSettingText };
};

export default useNotificationSetting;
