import { useState } from 'react';
import './App.css';
import LoginForm from './login/login.jsx';

function App() {
  const [text, setText] = useState('');

  const handleClick = () => {
    alert(`You typed: ${text}`);
    // Later this becomes our Flask POST request
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
    </div>
  );
}

export default App;
