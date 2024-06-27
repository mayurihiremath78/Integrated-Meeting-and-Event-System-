import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import styles from 'C:/Users/kiran/task1_meeting_platform/src/Login.module.css'; // Adjust this path if needed
import { UserContext } from "C:/Users/kiran/task1_meeting_platform/src/UserContext.js";


function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const { setUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { username, password } = data;
    console.log('Submitting form with data:', data); // Debugging: log form data
  
    if (username && password) {
      try {
        const response = await axios.post('http://localhost:8000/Admin_Login', {
          username,
          password
        });
  
        console.log('Server response:', response.data);
        
        if (response.status === 200) {
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('adminUsername', username);
          setUser({ username });
          navigate('/CreateEvent'); // Redirect to admin dashboard page after successful login
        } else {
          console.error('Login failed:', response.data);
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
    } else {
      console.error('Username or password is missing');
    }
  };
  

  const onSuccess = (res) => {
    console.log(res); // Debugging to see the full response structure
    const googleUsername = res.profileObj.name; // Adjust this according to Google's response structure

    // Save username to localStorage and context
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminUsername', googleUsername);
    setUser({ username: googleUsername });

    // Navigate to admin dashboard page or any other desired page
    navigate('/CreateEvent');

    console.log("Welcome", googleUsername);
  };

  const onFailure = (res) => {
    console.log("Failed to log in", res);
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginHeader}>ADMIN SIGN IN</h1>
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

export default AdminLogin;
