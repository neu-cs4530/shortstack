import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import CommunityArticlePage from './main/communityPage/community/article/communityArticlePage';
import NotificationPage from './main/notificationPage';
import ProfilePage from './main/profilePage';
import CommunityList from './main/communityPage/communityList';
import CommunityPage from './main/communityPage/community/communityPage';
import NewCommunityPage from './main/newCommunity';
import useFakeStackOverflow from '../hooks/useFakeStackOverflow';
import PollPage from './main/pollComponent';
import CreatePollPage from './main/communityPage/community/poll/pollCreationPage';
import NotificationSettingsPage from './main/notificationPage/notificationSettings';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const { user, setUser } = useFakeStackOverflow(socket);

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />

        {/* Protected Routes */}
        {
          <Route
            element={
              <ProtectedRoute user={user} socket={socket}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path='/home' element={<QuestionPage />} />
            <Route path='/notifications' element={<NotificationPage />} />
            <Route path='/notifications/settings' element={<NotificationSettingsPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/new/question' element={<NewQuestionPage />} />
            <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
            <Route path='/community' element={<CommunityList />} />
            <Route path='/community/:communityID' element={<CommunityPage />} />
            <Route path='/community/article/:articleID' element={<CommunityArticlePage />} />
            <Route path='/community/poll/:pollID' element={<PollPage />} />
            <Route path='/community/:communityID/createPoll' element={<CreatePollPage />} />
            <Route path='/community/create' element={<NewCommunityPage />} />
            <Route path='/profile/:tab' element={<ProfilePage />} />
          </Route>
        }
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
