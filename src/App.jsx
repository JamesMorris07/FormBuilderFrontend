import { useState } from 'react';
import './App.css';
import LoginForm from './login/login.jsx';
import RegisterForm from './register/register.jsx';
import Datatable from './datatable/datatable.jsx';

function App() {

  const [authView, setAuthView] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return <Datatable />;
  }

  return (
    <div className="app-wrapper">
      <h1>Intake Form MVP</h1>

      <div className="main-content">
        {authView === "login" && (
          <LoginForm
            setAuthView={setAuthView}
            setLoggedIn={setLoggedIn}
          />
        )}

        {authView === "register" && (
          <RegisterForm
            setAuthView={setAuthView}
          />
        )}
      </div>
    </div>
  );
}

export default App;