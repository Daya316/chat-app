// src/Chat.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002'); // Make sure this matches your backend port

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    // Clean up the listener when component unmounts
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', message); // Send message to server
      setMessage(''); // Clear input
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>💬 Real-Time Chat</h2>

      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        height: '300px',
        overflowY: 'scroll',
        marginBottom: '10px'
      }}>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input
        style={{ width: '80%', padding: '10px' }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
    </div>
  );
}

export default Chat;