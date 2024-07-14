import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./UpcomingEvents.css";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/UpcomingEvents');
        setEvents(response.data);
        console.log(events)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (event) => {
    navigate(`/Events_Details_Page`, { state: { event } });
  };

  return (
    <div className="app">
      <div className="content">
        <div className="events-container">
          <h1>Upcoming Events</h1><br/>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="events-grid">
              {events.map((event, index) => (
                <div key={index} className="event-card">
                  <div className="card-header">
                    <span className="certification">
                      {event.certified === "true" ? 'Certified' : 'Not Certified'}
                    </span>
                    <span className="price-status">
                      {event.freeorpaid}
                    </span>
                  </div>
                  <img src={`data:image/jpeg;base64,${event.photo}`} alt={event.eventname} className="event-image" />
                  <div className="card-header">
                    <h3 className="event-name">{event.eventname}</h3>
                  </div>
                  <div className="card-content">
                    <div className="event-details">
                      <p>Hosted by: <span className="host-name">{event.hostname}</span></p>
                    </div>
                    <div className="event-details">
                      <p>Start Date: {formatDate(event.date)}</p>
                      <p>End Date: {formatDate(event.enddate)}</p>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div>
                      <button className="details-button" onClick={() => handleViewDetails(event)}>View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;