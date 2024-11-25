import { NotificationType } from '../../../../types';
import './index.css';
import SettingView from './settingView';

/**
 * NotificationSettingsPage component that displays a user's notification settings.
 */
const NotificationSettingsPage = () => {
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
      <div className='notif_settings_header'>
        <div className='bold_title'>Notification Settings</div>
      </div>
      <div className='settings_section'>
        <h2>Question and Answer Notifications</h2>
        <div className='notification_list'>
          {questionSettings.map((type, idx) => (
            <SettingView notificationType={type} key={idx}></SettingView>
          ))}
        </div>
      </div>
      <div className='settings_section'>
        <h2>Reward Notifications</h2>
        <div className='notification_list'>
          {rewardSettings.map((type, idx) => (
            <SettingView notificationType={type} key={idx}></SettingView>
          ))}
        </div>
      </div>
      <div className='settings_section'>
        <h2>Community Notifications</h2>
        <div className='notification_list'>
          {communitySettings.map((type, idx) => (
            <SettingView notificationType={type} key={idx}></SettingView>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
