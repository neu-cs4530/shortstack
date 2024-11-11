import React from 'react';
import './index.css';
import { Notification, NotificationType } from '../../../../types';

/**
 * Interface representing the props for the NotificationView component.
 *
 * notif - The notification object containing details about the notification.
 */
interface NotificationProps {
  notif: Notification;
}

/**
 * NotificationView component that displays the content of a notification.
 *
 * @param text The content of the answer.
 * @param
 */
const NotificationView = ({ notif }: NotificationProps) => {
  /**
   * Function that determines the text displayed in a notification
   * @param notifType - The type of notification that needs to be displayed
   * @returns the string that contains the notification's text.
   */
  const notifSourceText = (notifType: NotificationType): string => {
    let text = '';
    switch (notifType) {
      case 'Answer':
        text = 'Someone has answered your question.';
        break;
      case 'Comment':
        text = 'Someone has commented on your question.';
        break;
      case 'AnswerComment':
        text = 'Someone has commented on your answer.';
        break;
      case 'Upvote':
        text = 'You have receieved an upvote.';
        break;
      case 'NewQuestion':
        text = 'A new question has been posted in your community.';
        break;
      case 'NewPoll':
        text = 'A new poll has been posted in your community.';
        break;
      case 'PollClosed':
        text = 'A poll has closed. See its results!';
        break;
      case 'NewArticle':
        text = 'A new article has been posted in your community.';
        break;
      case 'ArticleUpdate':
        text = 'An article in your community has been updated.';
        break;
      default:
        text = 'Congrats! You have unlocked a new reward!s';
    }
    return text;
  };

  return (
    <button className={notif.isRead ? 'notif_container' : 'notif_container unread'}>
      <div></div>
      <div>
        <h6>{notifSourceText(notif.notificationType)}</h6>
        {notif.source && notif.sourceType ? <p>{notif.source.title}</p> : ''};
      </div>
    </button>
  );
};

export default NotificationView;
