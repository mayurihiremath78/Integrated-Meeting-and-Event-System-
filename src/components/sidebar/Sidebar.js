// Sidebar.js
// import 'C:/Users/kiran/task1_meeting_platform/src/components/sidebar/Sidebar.css';
// import CertificateCards  from '../../CertificateCards';
// import EventsList from '../../EventsList';
// import About from 'C:/Users/kiran/task1_meeting_platform/src/components/pages/About.js';

// Sidebar.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'C:/Users/kiran/task1_meeting_platform/src/components/sidebar/Sidebar.css';
import CertificateCards  from '../../CertificateCards';
import EventsList from '../../EventsList';
import About from 'C:/Users/kiran/task1_meeting_platform/src/components/pages/About.js';
import Login from 'C:/Users/kiran/task1_meeting_platform/src/Login.js'
import { UserContext } from '../../UserContext'; // Import UserContext
import EventsHistory from '../../EventsHistory';

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
        navigate('/Login');
    };

    return (
        <div className="sidebar">
            <div className="profile">
                <img src="https://via.placeholder.com/150" alt="Profile" />
                <h3>{name || (user && user.username)}</h3>
                <p>{contact}</p>
            </div>
            <div className="menu">
                <Link to="/" className="menu-item">
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/EventsHistory" className="menu-item active">
                    <FaRegCalendarAlt />
                    <span>Events History</span>
                </Link>
                <Link to="/payment" className="menu-item">
                    <FaRegCreditCard />
                    <span>Payment</span>
                </Link>
                <Link to="/CertificateCards" className="menu-item">
                    <FaCertificate />
                    <span>Certificates</span>
                </Link>
                <Link to="/EventsList" className="menu-item">
                    <FaChartBar />
                    <span>Events</span>
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
