import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Certificate from './Certificate.js';
import Sidebar from './components/sidebar/Sidebar'; 

const CertificateCards = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/certificate_data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Function to chunk events into arrays of 2 for two per row layout
  const chunkEvents = (arr, size) => {
    return arr.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = []; // start a new chunk
      }
      chunks[chunkIndex].push(item);
      return chunks;
    }, []);
  };

  const navigate = useNavigate();

  const handleDownloadCertificate = (event) => {
    navigate(`/Certificate`, { state: { event } });
  };

  // Chunk events into groups of 2 per row
  const chunkedEvents = chunkEvents(events, 2);

  return (
    <div>
      <h1>Certified Events</h1>
      <div className="flex flex-col items-center" style={{width:"80%", marginLeft:"18%"}}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="w-full max-w-screen-lg" style={{ marginTop: '70px' }}>
            {chunkedEvents.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-4">
                {row.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center border rounded-lg shadow-lg mx-2"
                    style={{ maxWidth: '550px', minWidth: '500px', marginLeft: '40px' }} // Adjust max width of each card as needed
                  >
                    {event.photo && (
                      <img
                        src={`data:image/jpeg;base64,${event.photo}`}
                        alt={event.eventname}
                        className="object-cover rounded-t-lg"
                        style={{ width: '350px', height: '262px' }} // Fixed image size
                      />
                    )}
                    <div className="p-4 w-full">
                      <div className="text-right text-sm text-zinc-500">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <h1>{event.eventname}</h1>
                      <p className="text-zinc-500 mb-1">Host Name:  {event.hostname}</p>
                      <p className="mb-4">Description:  {event.description}</p>
                     
                        <button className="bg-black text-white py-2 px-4 rounded-lg w-full" style={{ marginLeft: '100px' }} onClick={() => handleDownloadCertificate(event)}>
                          Download Certificate
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCards;
