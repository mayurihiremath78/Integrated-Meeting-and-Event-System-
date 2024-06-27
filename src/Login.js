// Login.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { UserContext } from './UserContext';

import styles from './Login.module.css';

function Login() {
  const { register, handleSubmit, getValues } = useForm();
  const { setUser, updateName } = useContext(UserContext); // Destructure updateName from context
  const navigate = useNavigate();

  const onSubmit = async () => {
    const { name, contact, username, password } = getValues();
    if (name && contact && username && password) {
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('username', name);
      updateName(name); // Update name in context
      setUser({ name });
      navigate('/EventsList'); // Redirect to event details page after successful login
    }
    try {
      const response = await axios.post('http://localhost:8000/login', {
        name,
        contact,
        username,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const onSuccess = (res) => {
    console.log(res); // Debugging to see the full response structure
    const googleUsername = res.profileObj.name; // Adjust this according to Google's response structure

    // Save username to localStorage and context
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('username', googleUsername);
    updateName(googleUsername); // Update name in context
    setUser({ username: googleUsername });

    // Navigate to events list page or any other desired page
    navigate('/EventsList');

    console.log("Welcome", googleUsername);
  };

  const onFailure = (res) => {
    console.log("Failed to log in", res);
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginHeader}>SIGN IN</h1>
      <div className={styles.socialLoginContainer}>
        <GoogleLogin
          clientId="259810239126-tao3bmh8dhl6g8qu6agh09eb0284mi0g.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          className={styles.googleLoginButton}
        />
        <br /><br />
      </div>
      <span className={styles.loginSpan}>Or use your account</span>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <label>Name:</label>
        <input type="text" {...register("name")} />
        <br />

        <label>Contact:</label>
        <input type="text" {...register("contact")} />
        <br />

        <label>Username:</label>
        <input type="text" {...register("username")} />
        <br />
        <label>Password:</label>
        <input type="password" {...register("password")} />
        <br />

        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
