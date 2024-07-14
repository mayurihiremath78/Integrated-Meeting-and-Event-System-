import React, { useState, useEffect } from 'react';
import "C:/Users/kiran/task1_meeting_platform/src/Dashboard.css";

const ViewEventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const params = new URLSearchParams(window.location.search);
  const eventname = params.get('eventname');

  useEffect(() => {
    console.log(`Fetching registrations for event: ${eventname}`);
    fetch(`http://localhost:8000/Admin_EventsHistory/eventregistrations?eventname=${eventname}`)
      .then(response => response.json())
      .then(data => {
        console.log('Registrations:', data);
        setRegistrations(data);
      })
      .catch(error => console.error('Error fetching event registrations:', error));
  }, [eventname]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAttendeceClick = () => {
    console.log("Redirecting to Attendece PAge'");
   
  };

  return (
    <div>
      <h1>Event Registrations for {eventname}</h1>
      {registrations.length === 0 ? (
        <div>No registrations found</div>
      ) : (
        <table style={{ marginLeft: "18%", width: "82%" }}>
          <thead >
            <tr >
            <th>UserId</th>
              <th>Username</th>
              <th>Registration Date</th>
              <th>Payment</th>
              <th>Attendece</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration, index) => (
              <tr key={index}>
              <td>{registration.userid}</td>
                <td>{registration.username}</td>
                <td>{formatDate(registration.registration_date)}</td>
                <td>{registration.payment}</td>
                <td className="button-container">
                  <button onClick={() => handleAttendeceClick()}  className="delete">Attendece</button>
                </td>
                {/* Add more columns as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewEventRegistrations;