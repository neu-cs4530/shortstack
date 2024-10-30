import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event for username input.
   *
   * @param e - the event object.
   */
  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the input change event for password input.
   *
   * @param e - the event object.
   */
  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to set the current username and password to empty
   */
  const clearInputs = () => {
    setPassword('');
    setUsername('');
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleLogIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser({
      username,
      password: '',
      totalPoints: 0,
      unlockedFrames: [],
      unlockedTitles: [],
      equippedFrame: '',
      equippedTitle: '',
    });
    // TODO: fetch User record from db, validate username + password, call setUser with User object
    navigate('/home');
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: implement signup here
    // verify username is unique
    navigate('/home');
  };

  return {
    username,
    handleUsernameInputChange,
    password,
    handlePasswordInputChange,
    handleLogIn,
    handleSignUp,
    hasAccount,
    setHasAccount,
    clearInputs,
  };
};

export default useLogin;
