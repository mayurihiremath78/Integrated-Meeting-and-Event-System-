import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserContext'; // Adjust the import path as necessary
import './ChattingPage.css';

const socket = io('http://localhost:8000');

function ChattingPage() {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectedUser, setConnectedUser] = useState('');
  const [admins, setAdmins] = useState([]); // Add a state for admins

  useEffect(() => {
    if (user.username) {
      // Emit 'userConnected' event with the username
      socket.emit('userConnected', user.username);
    }

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('userConnected', (username) => {
      setConnectedUser(username);
      // You can also display a message or handle this event as needed
    });

    // Fetch admins from the database
    fetch('/api/admins')
      .then(response => response.json())
      .then(data => setAdmins(data));

    return () => {
      socket.off('message');
      socket.off('userConnected');
    };
  }, [user.username]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const msg = { userId: user.username, msg: message };
    setMessages((prevMessages) => [...prevMessages, msg]);
    socket.emit('message', msg);
    setMessage('');
  };

  return (
    <div className="chat-container" style={{marginLeft:"17%"}}>
      <div className="chat-header">
        <h2>WASSUP</h2>
        <span>
          Admin: {admins.find(admin => admin.id === user.adminId)?.name} ({user.adminId})
          <ul>
            {admins.filter(admin => user.eventRegistrations.includes(admin.eventId)).map(admin => (
              <li key={admin.id}>
                <a href="#" onClick={() => socket.emit('startChat', admin.id)}>
                  {admin.name}
                </a>
              </li>
            ))}
          </ul>
        </span>
      </div>
      <div className="chat-body">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`message ${m.userId === user.username ? 'message-right' : 'message-left'}`}
          >
            <div className="message-sender">{m.userId === user.username ? 'You' : 'Admin'}</div>
            <div className="message-text">{m.msg}</div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Write a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {connectedUser && (
        <div className="user-connected-message">
          {`${connectedUser} has joined the chat.`}
        </div>
      )}
    </div>
  );
}

export default ChattingPage;