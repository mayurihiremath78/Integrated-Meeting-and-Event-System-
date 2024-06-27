import React ,{ useContext } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Certificate.css';
import { UserContext } from './UserContext';


const Certificate = () => {
  const location = useLocation();
  const event = location.state?.event;

  const { name } = useContext(UserContext);
  console.log({name})

  if (!event) {
    return <p>No event data found.</p>;
  }

  console.log(event);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDownload = () => {
    const certificate = document.getElementById('certificate');
    html2canvas(certificate).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save(`${event.eventname}-certificate.pdf`);
    });
  };

  return (
    <div style={{marginTop:"100px"}}>
      <div id="certificate" className="certificate-container">
        <div className="flex justify-between items-center mb-4">
          <img src="https://placehold.co/50x50" alt="LOGO OF HOST" className="badge"></img>{event.hostname}
          <img src="https://placehold.co/50x50" alt="golden badge" className="badge"></img>
        </div>
        
        <h2 className="certificate-subtitle" style={{marginLeft:'130px'}}>CERTIFICATE</h2>
        <h3 className="certificate-achievement">OF ACHIEVEMENT</h3>
        <p className="certificate-present">THIS CERTIFICATE IS PRESENT TO :</p>
        <p className="certificate-username">NAME is: {name}</p>
        <p className="certificate-message">Hopefully this achievement will be the first step towards bigger success. Keep trying and give your best from {formatDate(event.date)} to {formatDate(event.enddate)}.</p>
        <div className="signature-container">
          <div className="signature">
            <hr className="signature-line"></hr>
            <p>CEO</p>
          </div>
          <div className="signature">
            <hr className="signature-line"></hr>
            <p>Manager</p>
          </div>
        </div>
      </div>
      <button onClick={handleDownload} style={{marginLeft:"700px"}}>Download Certificate</button>
    </div>
  );
};

export default Certificate;
