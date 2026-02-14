import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('') // joce added state for input text

  const handleClick = () => { // joce added click handler for button
    alert(`You typed: ${text}`) //instead of the alert, here is where we call up flask api to send the text to the backend and get a response back. For now, we will just alert the text.
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <h1>Intake Form MVP</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        {/* joce added new input and input button below the count button */}
        {/* New input + button row */}
        <div className="input-row">
          <input
            type="text"
            placeholder="Type text here"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleClick}>
            Submit
          </button>
        </div>
        {/* joce added new input and input button above the count button above here*/}

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more.
      </p>
    </>
  )
}

export default App
