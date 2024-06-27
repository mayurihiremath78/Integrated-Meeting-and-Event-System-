import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import "./EventsHistory.css";

const EventsHistory = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.id && user.username) {
      fetchEventsHistory();
    }
  }, [user]);

  const fetchEventsHistory = async () => {
    try {
      const response = await axios.post('http://localhost:8000/EventsHistory', {
        userid: user.id,
        username: user.username
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  const handleYesClick = (index) => {
    console.log(`Edit button clicked for event at index ${index}`);
    // Implement edit logic here if needed
  };

  const handleNoClick = (index) => {
    console.log(`Delete button clicked for event at index ${index}`);
    // Implement delete logic here if needed
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ width: "80%", marginLeft: "20%" }}>
      <h1>Events History</h1>
      {events.length === 0 ? (
        <div>No event data found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Host Name</th>
              <th>Event Name</th>
              <th>Description</th>
              <th>Tech Stack</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Payment</th>
              <th>Certificate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.hostname}</td>
                <td>{event.eventname}</td>
                <td>{event.description}</td>
                <td>{event.techstack}</td>
                <td>{formatDate(event.startdate)}</td>
                <td>{formatDate(event.enddate)}</td>
                <td>{event.payment}</td>
                <td>View</td>
                <td className="button-container">
                  <button onClick={() => handleYesClick(index)} className="edit">Details</button>
                  <button onClick={() => handleNoClick(index)} className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventsHistory;
