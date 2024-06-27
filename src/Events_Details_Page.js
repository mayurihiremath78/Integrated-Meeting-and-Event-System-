import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Events_Details_Page.css";

import Payment from './Payment';
import EventsHistory from './EventsHistory.js';

const Events_Details_Page = () => {
  const location = useLocation();
  const event = location.state?.event;
  const navigate = useNavigate();

  if (!event) {
    return <p>No event data found.</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleJoinEvent = () => {
    if (event.freeorpaid.toLowerCase() === 'paid') {
      navigate('/Payment', { state: { event } });
    } else {
      navigate('/EventsHistory', { state: { event } });
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <div className="bg-blue-200 p-6 rounded-lg shadow-lg max-w-4xl mx-auto" style={{marginLeft:"25%"}}>
        <div className="flex justify-center">
          {event.photo && (
            <img
              className="event-image"
              src={`data:image/jpg;base64,${event.photo}`}
              alt={event.eventname}
            />
          )}
        </div>  
        <br />
        <span className="text-lg font-light">Starts On: {formatDate(event.date)}</span>
        <span className="text-lg font-light" style={{marginLeft:"65%"}}>Ends On: {formatDate(event.enddate)}</span>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            EVENT NAME: <span className="font-normal">{event.eventname}</span>
          </h2>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            HOST NAME: <span className="font-normal">{event.hostname}</span>
          </h3>
        </div>
        <div className="mb-4">
          <p className="font-bold">
            CERTIFICATION: <input type="checkbox" className="ml-2" checked={event.certified==="true"} readOnly />
          </p>
        </div>
        <div className="mb-4">
          <p className="font-bold">
            FREE / PAID: <span className="font-normal">{event.freeorpaid}</span>
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            TIME: <span className="font-normal">{event.time}</span>
          </h3>
        </div>
        <div className="mb-4">
          <p className="font-bold">DESCRIPTION: {event.description}</p>
          <p className="font-bold">DETAILED DESCRIPTION: <span className="font-normal">{event.longdescription}</span></p>
        </div>
        <div className="mb-4">
          <p className="font-bold">
            LIMIT OF PEOPLE: <span className="font-normal">{event.limitofpeople}</span>
          </p>
        </div>
        <div className="mb-4">
          <p className="font-bold">
            TECH STACK: <span className="font-normal">{event.techstack}</span>
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" style={{width:'100px'}} onClick={handleJoinEvent}>Join Event</button>
        </div>
      </div>
    </div>
  );
};

export default Events_Details_Page;
