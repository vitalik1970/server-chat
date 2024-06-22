import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';



const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Подключение к сокету
    socketRef.current = io();

    // Обработка сообщений от сервера
    socketRef.current.on('chat message', (msg, id, name) => {
      setMessages((prevMessages) => [...prevMessages, { msg, name }]);
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Очистка при размонтировании компонента
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue && username) {
      socketRef.current.emit('chat message', inputValue, Date.now(), username, () => {
        setInputValue('');
      });
    }
  };

  return (
    <div className='bone' >
        Оставте свой отзыв о сайте
      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.name}:</strong> {message.msg}
          </li>
        ))}
      </ul>

      <form id="form" onSubmit={handleSubmit} className='feedbackform' >
      <label htmlFor="name"></label>
      <input type="text" id="username"  placeholder="NAME*" className='feedback__form' name="name"  autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)}/>

      <label htmlFor="message"></label>
      <textarea id="input" placeholder="MESSAGE*" className='feedback__form'  name="message" autoComplete="off" value={inputValue} onChange={(e) => setUsername(e.target.value)}></textarea>

      <button className="button__form" disabled type="submit">
        SEND
      </button>
    </form>
    </div>
  );
};

export default Chat;
