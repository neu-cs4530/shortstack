import React from 'react';
import './index.css';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const {
    username,
    password,
    handleLogIn,
    handleSignUp,
    handleUsernameInputChange,
    handlePasswordInputChange,
    hasAccount,
    setHasAccount,
    clearInputs,
  } = useLogin();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      {hasAccount ? (
        <h4>
          Please login or{' '}
          <a
            className='sign-up-toggle'
            onClick={_ => {
              setHasAccount(!hasAccount);
              clearInputs();
            }}>
            sign up
          </a>
        </h4>
      ) : (
        <h4>
          Have an account already?{' '}
          <a
            className='sign-up-toggle'
            onClick={_ => {
              setHasAccount(!hasAccount);
              clearInputs();
            }}>
            Log in
          </a>
        </h4>
      )}
      <form onSubmit={hasAccount ? handleLogIn : handleSignUp}>
        <input
          type='text'
          value={username}
          onChange={handleUsernameInputChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <br />
        <input
          type='text'
          value={password}
          onChange={handlePasswordInputChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id={'passwordInput'}
        />
        <br />
        <button type='submit' className='login-button'>
          {hasAccount ? 'Log In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Login;
