import React from 'react';
import './Content.css';
import {  useNavigate } from 'react-router-dom';
import "C:/Users/kiran/task1_meeting_platform/src/admin/Admin_login.js"

import 'C:/Users/kiran/task1_meeting_platform/src/EventsList.js';

export default function Content() {

  const isUserLoggedIn = () => {
    // Implement your login check logic here
    // For example, check a value in localStorage
    return localStorage.getItem('userLoggedIn') === 'true';
  }

  const navigate = useNavigate()

  const CreateEventFunn= () => {
    // Navigate to the desired route
    navigate("/Admin_login");
    //alert("Hii")
   
  }


  const EventsListFunn=() =>
    {
      //if user is already logged in then g to events list page  else  go to login page
    if (isUserLoggedIn()) {
      navigate("/EventsList"); // Replace with the actual event details path
    } else {
      navigate("/Login");
    }
  }
  return (
    <div className="content">
      <div className="section">
        <h3>MEETING</h3><br></br><br></br>
        <button className="btn_content">Create Meet</button>
        <button className="btn_content">Join Meet</button>
      </div>
      <div className="section">
        <h3>EVENT</h3><br></br>
        <button className="btn_content" id="CreateEvent_Button" onClick={() => CreateEventFunn()}>Create Event</button>
        <button className="btn_content" id="EventsList_Button" onClick={() => EventsListFunn()}>Join Event</button>
      </div>
    </div>
  );
}