import { useState } from 'react';
import './App.css';
import LoginForm from './login/login.jsx';

function App() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState(''); // To show backend confirmation

  const handleClick = async () => {
    if (!text) return setMessage('Please enter some text');

    try {
      const res = await fetch('http://127.0.0.1:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.message) {
        setMessage(`Successfully posted "${text}" to database!`);
        setText(''); // clear input after success
      } else if (data.error) {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Intake Form MVP</h1>

      <LoginForm />

      <div className="test-input-container">
        <input
          type="text"
          placeholder="Test POST input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleClick}>
          Submit
        </button>
      </div>

      {message && <p className="confirmation-message">{message}</p>}
    </div>
  );
}

export default App;