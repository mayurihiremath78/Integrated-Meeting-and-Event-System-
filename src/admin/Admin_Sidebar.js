// Sidebar.js

// Sidebar.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import 'C:/Users/kiran/task1_meeting_platform/src/admin/Admin_Sidebar.css';
import Payment from "C:/Users/kiran/task1_meeting_platform/src/Payment.js";
import Admin_EventsHistory  from './Admin_EventsHistory.js';
import Admin_login from "./Admin_login.js"

import UpcomingEvents from './UpcomingEvents';
import PastEvents from './PastEvents';
import OngoingEvents from './OngoingEvents';

import { FaHome, FaRegCalendarAlt, FaRegCreditCard, FaCertificate, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

 const Sidebar = () => {
 const { user, setUser, name, contact } = useContext(UserContext); // Get user, setUser, name, and contact from context
  const navigate = useNavigate();

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
        navigate('/Admin_login');
    };

    return (
        <div className="sidebar">
            <div className="profile">
                <img src="https://via.placeholder.com/150" alt="Profile" />
                 <h3>{name || (user && user.username)}</h3>
                <p>{contact ||(user &&user.Contact)}</p> 
            </div>
            <div className="menu">
                <Link to="/" className="menu-item">
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/Admin_EventsHistory" className="menu-item active">
                    <FaRegCalendarAlt />
                    <span>Events History</span>
                </Link>
                <Link to="/Admin_Chatting" className="menu-item">
                    <FaRegCreditCard />
                    <span>Chatting</span>
                </Link>
                <Link to="/Payment" className="menu-item">
                    <FaCertificate />
                    <span>Payment</span>
                </Link>
                
             
            
<Link to="/" className="menu-item" onClick={(e) => e.target.classList.toggle('active')}>
  <FaChartBar />
  <span>Events</span>
  <ul>
    <li>
      <Link to="/UpcomingEvents" className="menu-item">Upcoming Events</Link>
    </li>
    <li>
      <Link to="/OngoingEvents" className="menu-item">Ongoing Events</Link>
    </li>
    <li>
      <Link to="/PastEvents" className="menu-item">Past Events</Link>
    </li>
  </ul>
</Link>
            
            </div>
            <div className="settings">
                <Link to="/settings" className="menu-item">
                    <FaCog />
                    <span>Settings</span>
                </Link>
            </div>
            <div className="help">
                <Link to="/about" className="menu-item">
                    <FaQuestionCircle />
                    <span>Help</span>
                </Link>
            </div>
            <div className="logout" onClick={handleLogout}>
                <div className="menu-item">
                    <FaSignOutAlt />
                    <span>Logout Account</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
