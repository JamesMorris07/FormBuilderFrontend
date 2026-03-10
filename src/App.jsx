import { useState } from 'react';
import './App.css';
import LoginForm from './login/login.jsx';
import RegisterForm from './register/register.jsx';
import Datatable from './datatable/datatable.jsx';

import DefaultForm from "./Forms/DefaultForm.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  const [authView, setAuthView] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN APP */}
        <Route path="/" element={
          loggedIn ? (
            <Datatable />
          ) : (
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
          )
        } />

        {/* KEEP HIS PAGE */}
        <Route path="/dev-form" element={<DefaultForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;