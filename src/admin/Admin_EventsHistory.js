import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from 'C:/Users/kiran/task1_meeting_platform/src/UserContext.js';
import "C:/Users/kiran/task1_meeting_platform/src/Dashboard.css";

const Admin_EventsHistory = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log('UserContext:', user);
    if (user && user.username) {
      console.log(`Fetching events for user: ${user.username}`);
      fetch(`http://localhost:8000/Admin_EventsHistory?username=${user.username}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching event data: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('EventData:', data); // Check the data received from the API
          setEvents(data);
        })
        .catch(error => console.error('Error fetching event data:', error));
    }
  }, [user]);

  const handleViewClick = (eventname) => {
    console.log(`Redirecting to ViewEventRegistrations page for event: ${eventname}`);
    window.location.href = `/ViewEventRegistrations?eventname=${eventname}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h1>Events History for Admin</h1>
      {events.length === 0 ? (
        <div>No event data found</div>
      ) : (
        <table style={{ marginLeft: "18%", width: "82%" }}>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>Event Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time</th>
              <th>Certified</th>
              <th>Free or Paid</th>
              <th>Tech Stack</th>
              <th>View Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.hostname}</td>
                <td>{event.eventname}</td>
                <td>{formatDate(event.date)}</td>
                <td>{formatDate(event.enddate)}</td>
                <td>{event.time}</td>
                <td>{event.certified === 'true' ? 'Yes' : 'No'}</td>
                <td>{event.freeorpaid}</td>
                <td>{event.techstack}</td>
                <td className="button-container">
                  <button onClick={() => handleViewClick(event.eventname)} className="delete">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin_EventsHistory;
