
//phtot added to dashboard
import React, { useEffect, useState } from 'react';
import "./Dashboard.css";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching event data: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('EventData:', data);
        setEvents(data);
      })
      .catch(error => console.error('Error fetching event data:', error));
  }, []);

  const handleYesClick = (index) => {
    console.log(`Yes button clicked for event at index ${index}`);
    // Add your logic for editing the event here
  };

  const handleNoClick = (index) => {
    console.log(`No button clicked for event at index ${index}`);
    // Add your logic for deleting the event here
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <div>
      <h1>Dashboard</h1>
      {events.length === 0 ? (
        <div>No event data found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>Event Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Time</th>
              <th>Certified</th>
              <th>Free or Paid</th>
              <th>Description</th>
              <th>Long Description</th>
              <th>Limit</th>
              <th>Tech Stack</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.hostname}</td>
                <td>{event.eventname}</td>
                <td> {formatDate(event.date)}</td>
                <td> {formatDate(event.enddate)}</td>
                <td>{event.time}</td>
                <td>{event.certified=="true" ? 'Yes' : 'No'}</td>
                <td>{event.freeorpaid}</td>
             
                <td>{event.description}</td>
                <td>{event.longdescription}</td>
                <td>{event.limitofpeople}</td>
                <td>{event.techstack}</td>
               
                <td className="button-container"> 
                  <button onClick={() => handleYesClick(index)} className="edit">Edit</button>
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

export default Dashboard;
