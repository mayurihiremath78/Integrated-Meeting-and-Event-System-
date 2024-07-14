import React, { useState, useEffect, useContext  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext'; 

import EventsHistory  from './EventsHistory';
import Events_Details_Page from './Events_Details_Page';
import "./EventsList.css";
import Payment from './Payment';



const EventsList = () => {

  
  const { username, userid } = useContext(UserContext); 

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courseType, setCourseType] = useState('');
  const [certification, setCertification] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/events_list');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data); // Initialize filtered events
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

  const handleFilterChange = () => {
    let filtered = events;

    // Apply filters manually
    if (courseType) {
      filtered = filtered.filter(event => event.freeorpaid === courseType);
    }
    
    if (certification === 'Yes') {
      // Assuming event.certified is a boolean field
      filtered = filtered.filter(event => event.certified === true);
    } else if (certification === 'No') {
      filtered = filtered.filter(event => event.certified !== true);
    }
    
    if (startDate) {
      // Convert startDate string to Date object for comparison
      const filterStartDate = new Date(startDate);
      filtered = filtered.filter(event => new Date(event.date) >= filterStartDate);
    }
    
    if (endDate) {
      // Convert endDate string to Date object for comparison
      const filterEndDate = new Date(endDate);
      filtered = filtered.filter(event => new Date(event.enddate) <= filterEndDate);
    }

    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        (event.eventName && event.eventName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (event.hostname && event.hostname.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
  
    setFilteredEvents(filtered);
    console.log(filtered); // Check filtered events in console
    setFilteredEvents(filtered);   
  };

  const handleSearch = () => {
    handleFilterChange(); // Trigger filter when search button is clicked
  };

  // const handleJoinEvent = async (event) => {
  //   try {
  //     if (event.freeorpaid.toLowerCase() === 'free') {
  //       // Register the event if it is free
  //       await axios.post('http://localhost:8000/registerEvent', {
  //         eventid: event.eventid,
  //         eventname: event.eventname,
  //         hostname:event.hostname,
  //         description:event.description,
  //         techstack:event.techstack,
  //         startdate:event.date,
  //         enddate:event.enddate,
  //         payment:"Failed",
  //         username: username,
  //         userid: userid,

  //       });
  
  //       // Navigate to EventsHistory page after successful registration
  //       navigate('/EventsHistory', { state: { event } });
  //     } else {
  //       // For paid events, navigate to payment page directly
  //       navigate('/Payment', { state: { event } });
  //     }
  //   } catch (error) {
  //     console.error('Error handling event:', error);
  //     // Handle errors, such as logging them or showing a user-friendly message
  //   }
  // };
  
  
  const handleJoinEvent = async (event) => {
    try {
      if (event.freeorpaid.toLowerCase() === 'free') {
        // Register the event if it is free
        await axios.post('http://localhost:8000/registerEvent', {
          eventid: event.eventid,
          eventname: event.eventname,
          hostname: event.hostname,
          description: event.description,
          techstack: event.techstack,
          startdate: event.date,
          enddate: event.enddate,
          payment: "Failed",
          username: username,
          userid: userid,
        });
      
      } else {
        // For paid events, navigate to payment page directly
        navigate('/Payment', { state: { event } });
      }
    } catch (error) {
      console.error('Error handling event:', error);
      // Handle errors, such as logging them or showing a user-friendly message
    }
  };

  return (
    <div className="app">
      <div className="content">
        <div className="filter-page">
          <h1 className="filter-header">Filter Courses</h1>
          <div className="filter-container">
            <div className="filter-item">
              <label htmlFor="course-type">Course Type:</label>
              <select
                id="courseType"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="filter-item">
              <label htmlFor="certification">Certification:</label>
              <select
                id="certification"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="filter-item">
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button className="filter-button" onClick={handleFilterChange}>Apply Filters</button>
          </div>
          <br></br>
          <br></br>
          <label htmlFor="search">Search by Event Name :</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} style={{width:"30%"}}
          />
          <button className="filter-button" onClick={handleSearch}>Search</button>
        </div>

        <div className="events-container">
          <h1>Events Details</h1><br></br>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <div key={index} className="event-card">
                  <div className="card-header">
                    <span className="certification">
                      {event.certified === "true" ? 'Certified' : 'Not Certified'}
                    </span>
                    <span className="price-status">
                      {event.freeorpaid}
                    </span>
                  </div>
                  
                  {event.photo && (
                    <img
  className="event-image"
  src={`data:${event.mimetype};base64,${event.photo}`}
  alt={event.eventname}
/>
              )}
                  
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
                    <div style={{ display: 'flex', justifyContent: 'pace-between' }}>
                      <button className="join-button" onClick={() => handleJoinEvent(event)} style={{width:"30%"}}> Join Now</button>
                      <button className="details-button" onClick={() => handleViewDetails(event)} style={{width:"30%",marginLeft:"39%"}}>View Details</button>
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

export default EventsList;
