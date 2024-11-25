import useUserContext from '../../../../hooks/useUserContext';
import { NotificationType } from '../../../../types';
import './index.css';
import SettingView from './settingView';

/**
 * NotificationSettingsPage component that displays a user's notification settings.
 */
const NotificationSettingsPage = () => {
  const { user } = useUserContext();

  const questionSettings = [
    NotificationType.Answer,
    NotificationType.Comment,
    NotificationType.AnswerComment,
    NotificationType.Upvote,
  ];
  const rewardSettings = [NotificationType.NewReward];
  const communitySettings = [
    NotificationType.NewQuestion,
    NotificationType.NewArticle,
    NotificationType.ArticleUpdate,
    NotificationType.NewPoll,
    NotificationType.PollClosed,
  ];

  return (
    <div>
      <div className='space_between right_padding'>
        <div className='bold_title'>Notification Settings</div>
      </div>
      <div className='settings_section'>
        <h2>Question and Answer Notifications</h2>
        <div className='notification_list'>
          {questionSettings.map((type, idx) => (
            <SettingView
              notificationType={type}
              username={user.username}
              blockedNotifications={user.blockedNotifications}
              key={idx}></SettingView>
          ))}
        </div>
      </div>
      <div className='settings_section'>
        <h2>Reward Notifications</h2>
        <div className='notification_list'>
          {rewardSettings.map((type, idx) => (
            <SettingView
              notificationType={type}
              username={user.username}
              blockedNotifications={user.blockedNotifications}
              key={idx}></SettingView>
          ))}
        </div>
      </div>
      <div className='settings_section'>
        <h2>Community Notifications</h2>
        <div className='notification_list'>
          {communitySettings.map((type, idx) => (
            <SettingView
              notificationType={type}
              username={user.username}
              blockedNotifications={user.blockedNotifications}
              key={idx}></SettingView>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
