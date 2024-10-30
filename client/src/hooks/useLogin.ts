import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import addUser from '../services/userService';

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
  const [signupErr, setSignupErr] = useState<string>('');
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

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newUser = await addUser({
        username,
        password,
        totalPoints: 0,
        unlockedFrames: [],
        unlockedTitles: [],
        equippedFrame: '',
        equippedTitle: '',
      });
      setUser(newUser);
      navigate('/home');
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'string'
      ) {
        // get response to display unique username error message
        setSignupErr(error.response.data);
      }
    }
  };

  return {
    username,
    handleUsernameInputChange,
    password,
    handlePasswordInputChange,
    handleLogIn,
    handleSignUp,
    signupErr,
    hasAccount,
    setHasAccount,
    clearInputs,
  };
};

export default useLogin;
