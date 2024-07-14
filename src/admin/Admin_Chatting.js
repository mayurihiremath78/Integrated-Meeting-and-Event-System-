import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Admin_Chatting.css'; // Import your CSS for styling

const socket = io('http://localhost:8000'); // Adjust according to your server setup

function AdminChattingPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [data, ...prevMessages]); // New messages at the beginning
    });

    // Clean up socket listeners when component unmounts
    return () => {
      socket.off('message');
    };
  }, []);

  const handleMessageClick = (msg) => {
    setSelectedMessage(msg);
  };

  const handleSendMessage = () => {
    if (!selectedMessage) return;
    const msg = { userId: 'admin', msg: message }; // Admin is sending the message
    setMessages((prevMessages) => [...prevMessages, msg]);
    socket.emit('message', msg);
    setMessage('');
  };

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-sidebar">
        <h2>Users' Messages</h2>
        <div className="message-list">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-item ${selectedMessage === msg ? 'selected' : ''}`}
              onClick={() => handleMessageClick(msg)}
            >
              <div className="message-sender">{msg.userId}</div>
              <div className="message-text">{msg.msg}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-chat-main">
        {selectedMessage && (
          <div className="admin-chat-window">
            <div className="chat-header">
              <div className="message-sender">{selectedMessage.userId}</div>
            </div>
            <div className="chat-body">
              <div className="message-text">{selectedMessage.msg}</div>
            </div>
            <div className="chat-footer">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a reply..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChattingPage;
