import React, { useState } from 'react';
import "./CreateEvent.css";
import { Link, useNavigate } from 'react-router-dom';

const EventForm = () => {
  const [formValues, setFormValues] = useState({
    hostname: '',
    eventName: '',
    date: '',
    enddate: '',
    time: '',
    certified: false,
    freeOrPaid: 'free',
    eventPhotos: [],
    description: '',
    longDescription: '',
    limitOfPeople: '',
    techStack: 'webinar',
  });

  
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

      if (type === 'checkbox') {
      setFormValues({ ...formValues, [name]: checked });
    }
    else if (type === 'file') {
      setFormValues({ ...formValues, [name]: files });
    } 
   
    else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in formValues) {
      if (key === 'eventPhotos') {
        for (let i = 0; i < formValues[key].length; i++) {
          formData.append(key, formValues[key][i]);
        }
      }
     
      
      else if (key === 'certified') {
        formData.append(key, formValues[key] ? "true" : "false");
      } else {
        formData.append(key, formValues[key]);
      }
    }


    try {
      const response = await fetch('http://localhost:8000/create_event', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Event created successfully');
        alert('Event created successfully!!');
        navigate("/Dashboard");

      } else {
        const errorText = await response.text();
        console.error('Error creating event Client Side is: ',errorText);
      }
    }
    catch (error) {
      console.error('Error creating event', error.message, error.stack);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit} method="POST">
      <h2>HOST AN EVENT</h2>
      <label>
        Hostname: <input type="text" name="hostname" value={formValues.hostname} onChange={handleChange} required />
      </label>
      <label>
        Event Name: <input type="text" name="eventName" value={formValues.eventName} onChange={handleChange} required />
      </label>
     <label>
      Start  Date: <input type="date" name="date" value={formValues.date} onChange={handleChange} required />
      </label>
      <label>
      End  Date: <input type="date" name="enddate" value={formValues.enddate} onChange={handleChange} required />
      </label> 
      <label>
        Time: <input type="time" name="time" value={formValues.time} onChange={handleChange} required />
      </label>
      <label>
        Certified: <input type="checkbox" name="certified" checked={formValues.certified} onChange={handleChange} />
      </label>
      <label>
        Free or Paid:
        <select name="freeOrPaid" value={formValues.freeOrPaid} onChange={handleChange} required>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </label>
      <label>
        Event Photos: <input type="file" name="eventPhotos" multiple onChange={handleChange} required />
      </label>
      <label>
        Description: <textarea name="description" value={formValues.description} onChange={handleChange} required />
      </label>
      <label>
        Long Description: <textarea name="longDescription" value={formValues.longDescription} onChange={handleChange} required />
      </label>
      <label>
        Limit: <input type="number" name="limitOfPeople" value={formValues.limitOfPeople} onChange={handleChange} required />
      </label>
      <label>
        Tech Stack:
        <select name="techStack" value={formValues.techStack} onChange={handleChange} required>
          <option value="webinar">Webinar</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="meetup">Meetup</option>
          <option value="Mayuri">Mayuri</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default EventForm;
