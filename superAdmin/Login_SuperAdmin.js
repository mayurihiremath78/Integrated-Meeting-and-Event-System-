import React from 'react';
import { useForm } from 'react-hook-form';
import GoogleLogin from 'react-google-login';
import styles from './Login_SuperAdmin.module.css';
import axios  from 'axios';
function Login_SuperAdmin() {
  const { register, handleSubmit, getValues } = useForm();

  const onSubmit = async () => {
    const { username, password } = getValues();
  
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
      console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const onSuccess = (res) => {
    console.log("Welcome");
  };

  const onFailure = (res) => {
    console.log("Failed to log in");
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
      <form  onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
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

export default Login_SuperAdmin;
