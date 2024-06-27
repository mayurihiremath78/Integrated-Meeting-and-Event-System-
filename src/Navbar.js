import React, { useState, useEffect,useContext } from 'react';
import './Navbar.css';
import './Login'
import MeetLogo from 'C:/Users/kiran/task1_meeting_platform/src/MeetLogo.jpg';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from './UserContext';

export default function Navbar() {
  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [toggleMenu, setToggleMenu] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // Set the user from localStorage if available
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser({ username: loggedInUser });
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('username');
    setUser(null);
    navigate('/Login');
  };
  
  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', changeWidth);

    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, []);


  return (
    <nav>
      {(toggleMenu || screenWidth > 500) && (
        
        <ul className="list">
          <li className='logo'>   <img src={MeetLogo} alt="Logo" className="logo"/></li> 
          <li className="items">  <Link to="/">Home</Link></li>
          <li className="items">  <Link to="/about">About</Link></li>
          <li className="items">  <Link to="/contact">Contact</Link></li>
          <li className="items">  <Link to="/blogs">Blogs</Link></li>

          {user ? (
          <>
            <li  style={{ color: 'pink' }}>Welcome, {user.username}</li>
           <li> <button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/Login"><h1>Login</h1></Link></li>
        )}
        
         
        </ul>
      )}
    </nav>
  );

  
}
