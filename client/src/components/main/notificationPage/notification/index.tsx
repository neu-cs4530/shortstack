import React from 'react';
import './index.css';
import { FaArrowUp, FaCommentDots, FaFileAlt, FaGift, FaPoll } from 'react-icons/fa';
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
        text = 'Congrats! You have unlocked a new reward!';
    }
    return text;
  };

  /**
   * Function that determines the icon to use to display the notification
   * @param notifType - The type of notification that needs to be displayed
   * @returns the react icon that represents the notification
   */
  const notifIcon = (notifType: NotificationType): JSX.Element => {
    let icon: JSX.Element;
    switch (notifType) {
      case 'Answer':
      case 'Comment':
      case 'AnswerComment':
      case 'NewQuestion':
        icon = <FaCommentDots size='40px' />;
        break;
      case 'Upvote':
        icon = <FaArrowUp size='40px' />;
        break;
      case 'NewPoll':
      case 'PollClosed':
        icon = <FaPoll size='40px' />;
        break;
      case 'NewArticle':
      case 'ArticleUpdate':
        icon = <FaFileAlt size='40px' />;
        break;
      default:
        icon = <FaGift size='40px' />;
    }
    return icon;
  };

  return (
    <button className={notif.isRead ? 'notif_container' : 'notif_container unread'}>
      <div>{notifIcon(notif.notificationType)}</div>
      <div className='notif_text'>
        <h3>{notifSourceText(notif.notificationType)}</h3>
        {notif.source && notif.sourceType ? <p>Source: {notif.source.title}</p> : ''}
      </div>
    </button>
  );
};

export default NotificationView;
